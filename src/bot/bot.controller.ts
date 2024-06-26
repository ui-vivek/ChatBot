import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { Request, Response } from 'express';

@UseGuards(AuthenticationGuard)
@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Post('chat')
  async getChatbotResponse(@Body() bodyData: any, @Req() request: Request) {
    let user = JSON.parse(await request.get('user'));
    const message = bodyData.message;
    return await this.botService.getChatbotResponse(message,user);
  }
}
