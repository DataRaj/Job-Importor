import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schema';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagePref } from './schema/messagepref.schema';
import { Group } from 'src/group/schema/group.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(MessagePref.name) private messagePrefModel: Model<MessagePref>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  async createMessage(body: CreateMessageDto) {
    const msg = new this.messageModel({
      ...body,
      sender: new Types.ObjectId(body.sender),
      mediaUrl: body.mediaUrl,
      edited: body.edited ?? false,
    });
    const savedMsg = await msg.save();
    if (savedMsg) {
      const group = await this.groupModel
        .findById(body.groupId)
        .select('members');
      if (group) {
        const receiverIds = group.members.filter(
          (id) => id.toString() !== body.sender.toString(),
        );
        await this.messagePrefModel.insertMany(
          receiverIds.map((userId) => ({
            messageId: savedMsg._id,
            ownerId: userId,
            groupId: body.groupId,
          })),
        );
        return savedMsg;
      }
    }
  }

  async getMessagesForGroup(groupId: string) {
    // const msg=await this.messageModel
    //   .find({ groupId })
    //   .sort({ createdAt: 1 })
    //   .populate('sender');
    //   console.log(msg,'fetch messages');
    //   return msg
    const messages = await this.messageModel.aggregate([
      { $match: { groupId } },
      { $sort: { createdAt: 1 } },

      // Lookup deliveryInfo from messageprefs
      {
        $lookup: {
          from: 'messageprefs',
          localField: '_id',
          foreignField: 'messageId',
          as: 'deliveryInfo',
        },
      },

      // Lookup sender details
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      { $unwind: '$sender' },

      // Extract readByIds and deliveredToIds
      {
        $addFields: {
          readByIds: {
            $map: {
              input: {
                $filter: {
                  input: '$deliveryInfo',
                  as: 'info',
                  cond: { $eq: [{ $type: '$$info.readAt' }, 'date'] },
                },
              },
              as: 'readInfo',
              in: '$$readInfo.ownerId',
            },
          },
          deliveredToIds: {
            $map: {
              input: {
                $filter: {
                  input: '$deliveryInfo',
                  as: 'info',
                  cond: { $eq: [{ $type: '$$info.deliveredAt' }, 'date'] },
                },
              },
              as: 'deliveredInfo',
              in: '$$deliveredInfo.ownerId',
            },
          },
        },
      },

      // Lookup usernames for readBy
      {
        $lookup: {
          from: 'users',
          localField: 'readByIds',
          foreignField: '_id',
          as: 'readUsers',
        },
      },

      // Lookup usernames for deliveredTo
      {
        $lookup: {
          from: 'users',
          localField: 'deliveredToIds',
          foreignField: '_id',
          as: 'deliveredUsers',
        },
      },

      // Replace readBy and deliveredTo with array of usernames
      {
        $addFields: {
          readBy: {
            $map: {
              input: '$readUsers',
              as: 'user',
              in: '$$user.username',
            },
          },
          deliveredTo: {
            $map: {
              input: '$deliveredUsers',
              as: 'user',
              in: '$$user.username',
            },
          },
        },
      },

      // Optional cleanup (remove helper arrays)
      {
        $project: {
          readUsers: 0,
          deliveredUsers: 0,
          readByIds: 0,
          deliveredToIds: 0,
        },
      },
    ]);

    return messages;
  }

  async editMessage(msgId: string, content: any) {
    return await this.messageModel.findByIdAndUpdate(
      msgId,
      {
        $set: {
          content,
          edited: true,
        },
      },
      { new: true },
    );
  }

  async updateMessageDelivery(userId: string) {
    await this.messagePrefModel.updateMany(
      {
        ownerId: new Types.ObjectId(userId),
        deliveredAt: { $exists: false },
      },
      { $set: { deliveredAt: new Date() } },
    );
  }

  async updateMessageSeen(userId: string, roomId: string) {
    return await this.messagePrefModel.updateMany(
      {
        ownerId: new Types.ObjectId(userId),
        groupId: roomId,
        readAt: { $exists: false },
      },
      { $set: { readAt: new Date() } },
    );
  }

  async getUniqueGroupIds(userId: string) {
    const groupIds = await this.messagePrefModel
      .find({
        ownerId: new Types.ObjectId(userId),
        deliveredAt: { $exists: true },
      })
      .distinct('groupId');
    return groupIds;
  }
}
