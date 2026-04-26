import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBatchDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @Type(() => Number) @IsNumber() plantCount?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() expectedHarvestStart?: string;
  @IsOptional() @IsString() expectedHarvestEnd?: string;
}
