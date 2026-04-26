import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatchDto {
  @IsString() name!: string;
  @Type(() => Number) @IsNumber() plantCount!: number;
  @IsString() plantingDate!: string;
  @IsOptional() @IsString() variety?: string;
  @IsOptional() @IsString() spacing?: string;
  @IsOptional() @Type(() => Number) @IsNumber() acresCovered?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() expectedHarvestStart?: string;
  @IsOptional() @IsString() expectedHarvestEnd?: string;
  @IsOptional() @IsString() notes?: string;
}
