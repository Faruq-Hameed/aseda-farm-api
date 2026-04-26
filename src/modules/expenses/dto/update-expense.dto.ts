import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExpenseDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() item?: string;
  @IsOptional() @Type(() => Number) @IsNumber() amount?: number;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() vendor?: string;
  @IsOptional() @IsString() batchId?: string;
  @IsOptional() @IsString() notes?: string;
}
