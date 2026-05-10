import { SetMetadata } from '@nestjs/common';

export type MemberRole = 'OWNER' | 'MANAGER' | 'WORKER' | 'VIEWER';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);
