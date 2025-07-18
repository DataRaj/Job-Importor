import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async signup(dto: RegisterDto) {
    const { email, password, username } = dto;
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new ConflictException('email already in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      username,
      email,
      password: hashPassword,
    });
    return {
      message: 'user created successfully',
    };
  }

  async signin(loginAuthDto: LoginDto) {
    try {
      const { email, password } = loginAuthDto;
      const user = await this.userModel.findOne({ email: email });
      // console.log(user,'userrrrrrr')
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect  password');
      }
      const payload = { userId: user._id, username: user.username };
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
        message: 'Login successful',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred during sign in',
      );
    }
  }

  //route for listing users
  async findAllExcept(currentUserId: string): Promise<User[]> {
    return this.userModel.find({ _id: { $ne: currentUserId } });
  }

  async getUserInfo(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async getAllmembers(userId: string): Promise<User[]> {
    return this.userModel
      .find({ _id: { $ne: userId } })
      .select('-password -email');
  }
}
