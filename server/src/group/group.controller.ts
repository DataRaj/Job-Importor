import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { GroupService } from "./group.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }
    @UseGuards(AuthGuard)
    @Post()    
    async createGroup(@Body() body: { name: string; members: string[] }, @Req() req) {
        const { name, members } = body;
        return this.groupService.createGroup(name, req.user.userId,members);
    }
    @UseGuards(AuthGuard)
    @Get('my-groups')
    async getGroups(@Req() req) { 
        return this.groupService.getUserGroups(req.user.userId);
    }
}
 