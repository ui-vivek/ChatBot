import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';


@Schema()
export class User extends Document {
  // @Prop({  unique: true })  // Todo: uncomment this line when production ready
  // @IsInt()
  // userId: number;
  @Prop({ unique:true,required: true, trim: true, lowercase: true })
  @IsEmail()
  email: string;

  @Prop({ required: true, trim: true })
  name: string;


  @Prop({ required: true, minlength: 8 })
  password: string;
    
  @Prop({ default: Date.now })
  createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);

