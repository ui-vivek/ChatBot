import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/user.model';

@Module({
  providers: [BotService],
  exports: [],
  controllers: [BotController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class BotModule {}
