import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [AuthModule,BotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
