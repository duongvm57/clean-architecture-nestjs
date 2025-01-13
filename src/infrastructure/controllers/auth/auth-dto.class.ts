import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}