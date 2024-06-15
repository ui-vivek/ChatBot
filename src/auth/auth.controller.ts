import { Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {Response} from 'express'
import { loginDto } from "./dto/login.dto";

@Controller('user')
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
    @Post('/sign-in') 
    @UsePipes(new ValidationPipe())
    async login(@Body() loginData: loginDto, @Res() res: Response) {
      try {
        let response:any = await this._AuthService.loginUser(loginData);
        if(response.status === 403) 
          return res.status(403).send({status:403,data:{},message:"Invalid credentials"});
        if(response.status === 404)
          return res.status(404).send({status:404,data:{},message:"User not found"});
        return res.status(201).send({status:201,data:(response),message:"User found"});
      } catch (err) {
        throw err.message;
      }
    }
}