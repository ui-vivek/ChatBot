import { Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {Response} from 'express'

@Controller('auth')
export class AuthController{
    constructor(private _AuthService: AuthService,){}

    @Post('/sign-up')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createUser(@Body() userRegistration: CreateUserDto, @Res() res: Response,) {
      try {
        let response = await this._AuthService.createNewUser(userRegistration);
        return res.status(response.status).send(response);
      } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 500, data: {}, message: err.message });
      }
    }
    @Get()
    getUsers(){
        return "get users";
    }
}