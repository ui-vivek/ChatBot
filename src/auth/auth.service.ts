import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/model/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    try {
      const user = await this.userModel.find({
        email: email,
      });
      if (user.length > 0) return user[0];
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async createNewUser(userRegistration: CreateUserDto) {
    if (userRegistration.password !== userRegistration.confirmpassword) {
      return {
        status: 422,
        data: {},
        message: 'Password does not match confirm password',
      };
    }
    try {
      const user = await this.findUserByEmail(userRegistration.email);
      delete userRegistration.confirmpassword;
      const hashedPassword = await bcrypt.hash(userRegistration.password, 10);
      userRegistration.password = hashedPassword;
      const newUser = await this.userModel.create(userRegistration);
      const expiresIn = '24h';
      const token = await this.jwtService.signAsync(
        { id: newUser._id },
        { expiresIn },
      );
      return {
        status: 201,
        data: { token },
        message: 'User created successfully',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async loginUser(loginData: loginDto) {
    try {
      const user = await this.findUserByEmail(loginData.email);
      if (user) {
        const passwordCompare = await bcrypt.compare(
          loginData.password,
          user.password,
        );
        if (passwordCompare) {
          const expiresIn = '24h'
          let token = await this.jwtService.signAsync(
            { id: user._id },
            {
              expiresIn,
            },
          );
          let accessToken: any = {};
          accessToken.token = token;
          return accessToken;
        } else {
          return { status: 403, data: {}, message: 'Invalid credentials' };
        }
      } else {
        return { status: 404, data: {}, message: 'User Not Found' };
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
