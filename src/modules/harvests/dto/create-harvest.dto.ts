import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHarvestDto {
  @IsString() harvestDate!: string;
  @IsString() batchId!: string;
  @IsOptional() @Type(() => Number) @IsNumber() bunchCount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() avgBunchWeight?: number;
  @IsOptional() @Type(() => Number) @IsNumber() pricePerBunch?: number;
  @IsOptional() @IsString() buyer?: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @Type(() => Number) @IsNumber() suckerCount?: number;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @Type(() => Number) @IsNumber() soldCount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() pricePerSucker?: number;
  @IsOptional() @Type(() => Number) @IsNumber() revenue?: number;
  @IsOptional() @Type(() => Number) @IsNumber() replantedCount?: number;
}
