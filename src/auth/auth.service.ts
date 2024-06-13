import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "src/model/user.model";
import { Model } from "mongoose";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,private jwtService: JwtService,){}

    async findUserByEmail(email: string) {
        try {
          const user = await this.userModel.find({ email: email ,isDeleted: false});
          if(user.length > 0)
            return user[0];
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      }

    async createNewUser(userRegistration: CreateUserDto) {
        if (userRegistration.password !== userRegistration.confirmPassword) {
          return {
            status: 422,
            data: {},
            message: 'Password does not match confirm password',
          };
        }
        try {
          const user = await this.findUserByEmail(userRegistration.email);
          delete userRegistration.confirmPassword;
          const hashedPassword = await bcrypt.hash(userRegistration.password, 10);
          userRegistration.password = hashedPassword;
          const newUser = await this.userModel.create(userRegistration);
          const expiresIn = '24h'
          const token = await this.jwtService.signAsync({id:newUser._id},{expiresIn})
          return {
            status: 201,
            data: {token},
            message: 'User created successfully',
          };
        } catch (err) {
          console.log(err)
          throw new InternalServerErrorException(err);
        }
      }
}

