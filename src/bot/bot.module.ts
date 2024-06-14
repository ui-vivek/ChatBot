import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';

@Module({
  providers: [BotService],
  exports: [],
  controllers: [BotController],
  imports: [],
})
export class BotModule {}
