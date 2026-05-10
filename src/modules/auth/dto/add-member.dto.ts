import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class AddMemberDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsIn(['MANAGER', 'WORKER', 'VIEWER']) role?: string;
}
