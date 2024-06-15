import { IsArray, IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsNotEmpty, IsNumber, IsString, IsPostalCode, MinLength } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsEnum(['Male', 'Female', 'Others'])
    @IsNotEmpty()
    gender: string;
  
    @IsString()
    @MinLength(8)
    password: string;  
    
    @IsString()
    @MinLength(8)
    confirmpassword: string;
  }
  