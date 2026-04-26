import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CompleteTaskDto {
  @IsOptional() @IsString() completedAt?: string;
  @IsOptional() @Type(() => Number) @IsNumber() actualCost?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() weather?: string;
}
