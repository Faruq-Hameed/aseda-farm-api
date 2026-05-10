import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findAll(farmId: string) {
    return this.prisma.farmMember.findMany({
      where: { farmId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
        addedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateRole(memberId: string, dto: UpdateMemberDto, farmId: string, requestingUserId: string) {
    const membership = await this.prisma.farmMember.findFirst({ where: { id: memberId, farmId } });
    if (!membership) throw new NotFoundException('Member not found');
    if (membership.role === 'OWNER') throw new ForbiddenException('Cannot change the role of the farm owner');

    return this.prisma.farmMember.update({
      where: { id: memberId },
      data: { role: dto.role as any },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async remove(memberId: string, farmId: string, requestingUserId: string) {
    const membership = await this.prisma.farmMember.findFirst({ where: { id: memberId, farmId } });
    if (!membership) throw new NotFoundException('Member not found');
    if (membership.role === 'OWNER') throw new ForbiddenException('Cannot remove the farm owner');
    if (membership.userId === requestingUserId) throw new ForbiddenException('Cannot remove yourself');

    await this.prisma.farmMember.delete({ where: { id: memberId } });
    return { success: true };
  }

  async getActivityLog(farmId: string, userId?: string) {
    return this.prisma.activityLog.findMany({
      where: { farmId, ...(userId && { userId }) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        batch: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  async getChangeLog(farmId: string, userId?: string) {
    return this.prisma.changeLog.findMany({
      where: { ...(userId && { userId }), user: { memberships: { some: { farmId } } } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
