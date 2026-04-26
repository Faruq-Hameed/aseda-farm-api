import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHarvestDto {
  @IsOptional() @IsString() harvestDate?: string;
  @IsOptional() @Type(() => Number) @IsNumber() bunchCount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() avgBunchWeight?: number;
  @IsOptional() @Type(() => Number) @IsNumber() pricePerBunch?: number;
  @IsOptional() @IsString() buyer?: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() notes?: string;
  // sucker fields
  @IsOptional() @Type(() => Number) @IsNumber() suckerCount?: number;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @Type(() => Number) @IsNumber() soldCount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() pricePerSucker?: number;
  @IsOptional() @Type(() => Number) @IsNumber() replantedCount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() revenue?: number;
}
