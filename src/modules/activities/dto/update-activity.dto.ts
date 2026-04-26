import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateActivityDto {
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() batchId?: string;
  @IsOptional() @IsString() product?: string;
  @IsOptional() @IsString() quantity?: string;
  @IsOptional() @Type(() => Number) @IsNumber() cost?: number;
  @IsOptional() @Type(() => Number) @IsNumber() plantCount?: number;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() weather?: string;
  @IsOptional() @IsString({ each: true }) photos?: string[];
  @IsOptional() @IsString() notes?: string;
}
