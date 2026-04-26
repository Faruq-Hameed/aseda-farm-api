import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() product?: string;
  @IsOptional() @IsString() quantity?: string;
  @IsOptional() @Type(() => Number) @IsNumber() cost?: number;
  @IsOptional() @IsString() notes?: string;
}
