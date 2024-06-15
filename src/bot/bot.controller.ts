import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthenticationGuard } from 'src/guards/auth.guard';

@UseGuards(AuthenticationGuard)
@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Post('chat')
  async getChatbotResponse(@Body() bodyData: any) {
    const message = bodyData.message
    return await this.botService.getChatbotResponse(message);
  }
}
