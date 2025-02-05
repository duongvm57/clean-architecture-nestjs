import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ORDER_DIRECTION } from '../constants/constant';

export class BasePaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  per_page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ORDER_DIRECTION)
  order_direction?: ORDER_DIRECTION;
}