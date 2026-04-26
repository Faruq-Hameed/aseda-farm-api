import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityDto {
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() batchId?: string;
  @IsString() type!: string;
  @IsString() title!: string;
  @IsString() description!: string;
  @IsOptional() @IsString() product?: string;
  @IsOptional() @IsString() quantity?: string;
  @IsOptional() @Type(() => Number) @IsNumber() plantCount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() cost?: number;
  @IsOptional() @IsString() weather?: string;
  @IsOptional() photos?: string[];
}
