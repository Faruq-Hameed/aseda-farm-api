import { IsString, IsOptional } from 'class-validator';

export class TaskFilterDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() batchId?: string;
  @IsOptional() @IsString() priority?: string;
}
