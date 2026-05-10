import { IsEmail, IsString, MinLength, IsOptional, IsNumber, Min } from 'class-validator';

export class RegisterDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() farmName?: string;
  @IsOptional() @IsString() farmLocation?: string;
  @IsOptional() @IsNumber() @Min(0) totalAcres?: number;
}
