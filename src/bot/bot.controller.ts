import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Post('chat')
  async getChatbotResponse(@Body() bodyData: any) {
    const message = bodyData.message
    return await this.botService.getChatbotResponse(message);
  }
}
