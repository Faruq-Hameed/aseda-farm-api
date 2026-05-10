import { IsIn } from 'class-validator';

export class UpdateMemberDto {
  @IsIn(['MANAGER', 'WORKER', 'VIEWER']) role!: string;
}
