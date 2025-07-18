import {  Controller, Get, Param, UseGuards,  } from '@nestjs/common';
import { ChatService } from './chat.service';
// import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('messages')
export class ChatController {
    constructor(private readonly chatservice: ChatService) { }
    // @Post()
    // @UseGuards(AuthGuard)
    // async createMessage(@Body() body: CreateMessageDto, @Req() req) {
    //     const sender = req.user.userId
    //     return this.chatservice.createMessage({
    //         ...body,
    //         sender
    //     }) 
    // }

    @UseGuards(AuthGuard)
    @Get(':groupId')
    async getMessageByGroup(@Param('groupId') groupId: string) {
        return this.chatservice.getMessagesForGroup(groupId) 
    }


}
