import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signup')
    async signup(@Body() dto: RegisterDto) {
        return await this.authService.signup(dto)
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return await this.authService.signin(dto)
    }

    @Get('list')
    @UseGuards(AuthGuard)
    async getAllUsers(@Req() req): Promise<any> {
        // console.log(req.user.userId,'reqeeeeeeeeeeeeeeeeeee')
        const currentUserId = req.user.userId;
        // console.log(currentUserId,'current usr id')
        return this.authService.findAllExcept(currentUserId);
    }
}
