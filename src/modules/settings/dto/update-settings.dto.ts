import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingsDto {
  @IsOptional() @IsBoolean() emailEnabled?: boolean;
  @IsOptional() @Type(() => Number) @IsNumber() emailDaysBefore?: number;
  @IsOptional() @IsBoolean() dailyDigest?: boolean;
  @IsOptional() @IsString() digestTime?: string;
  @IsOptional() @IsBoolean() overdueAlerts?: boolean;
  @IsOptional() @IsBoolean() harvestAlerts?: boolean;
  @IsOptional() @IsBoolean() weeklyReport?: boolean;
}
