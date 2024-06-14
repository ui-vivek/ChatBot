import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class loginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  
  @IsNotEmpty()
  @IsBoolean()
  checkbox: boolean;
}
