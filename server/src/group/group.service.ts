import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model } from 'mongoose';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<Group>
    ) { }

    async createGroup(name: string, creatorId: string, members: string[]) {
        const allMembers = [creatorId, ...members];
        const group = new this.groupModel({ name, members: allMembers, createdBy: creatorId });
        return group.save();
    }
    async getUserGroups(userId: string) {
        return this.groupModel.find({ members: userId });
    }

    async updateLastMessage(groupId: string, content: string | null, mediaUrl: string | null) {
        let lastMessage: {
            content: string | null;
            msgType: string | null;
            createdAt: Date | null;
        };

        if (content && mediaUrl) {
            lastMessage = {
                content: content,
                msgType: 'mediaimage',
                createdAt: new Date(),
            };
        } else if (mediaUrl) {
            lastMessage = {
                content: null,
                msgType: 'image',
                createdAt: new Date(),
            };
        } else if (content) {
            lastMessage = {
                content: content,
                msgType: 'text',
                createdAt: new Date(),
            };
        } else {
            lastMessage = {
                content: null,
                msgType: null,
                createdAt: null,
            };
        }

        return this.groupModel.findByIdAndUpdate(
            groupId,
            { lastMessage },
            { new: true }
        );

    }


    async getGroupMemberIds(groupId: string): Promise<string[]> {
        const group = await this.groupModel.findById(groupId).select('members');
        if (!group) throw new Error('Group not found');
        return group.members.map((m: any) => m.toString());
    }



}
