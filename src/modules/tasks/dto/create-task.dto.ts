import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() category!: string;
  @IsOptional() @IsString() batchId?: string;
  @IsString() dueDate!: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() product?: string;
  @IsOptional() @IsString() quantity?: string;
  @IsOptional() @Type(() => Number) @IsNumber() cost?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsBoolean() isRecurring?: boolean;
  @IsOptional() @Type(() => Number) @IsNumber() recurEvery?: number;
}
