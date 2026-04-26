import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString() category!: string;
  @IsString() item!: string;
  @Type(() => Number) @IsNumber() amount!: number;
  @IsString() date!: string;
  @IsOptional() @IsString() vendor?: string;
  @IsOptional() @IsString() batchId?: string;
  @IsOptional() @IsString() notes?: string;
}
