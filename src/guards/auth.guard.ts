import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/user.model';
dotenv.config();

export class AuthenticationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, @Inject(JwtService) private readonly jwtService: JwtService,
  @InjectModel('User') private readonly userModel: Model<User>
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

   private async validateRequest(request: Request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_KEY });
      if(!decodedToken){
        throw new UnauthorizedException('Invalid token format');
      }
      let user = await this.userModel.findOne({_id: decodedToken.id},{password : 0})
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      request.headers.user = JSON.stringify(user);
      return true;
    } catch (error) {
      console.log("error", error)
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}