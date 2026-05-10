import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    // if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const membership = await this.prisma.farmMember.findFirst({
      where: { userId: user.id },
      include: { farm: { select: { id: true, name: true } } },
    });

    if (!membership) {
      throw new UnauthorizedException('No farm membership found for this account');
    }

    const farmId = membership.farmId;
    const role = membership.role;

    const payload = { sub: user.id, email: user.email, role, farmId };
    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        role,
        farmId,
        farmName: membership.farm?.name ?? null,
      },
    };
  }

  async register(dto: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    farmName?: string;
    farmLocation?: string;
    totalAcres?: number;
  }) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed, phone: dto.phone, role: 'OWNER' },
    });

    const farm = await this.prisma.farm.create({
      data: {
        ownerId: user.id,
        name: dto.farmName || 'ASEDA Farm',
        location: dto.farmLocation || 'Adesiyan Village, Olojuoro Road, Ibadan',
        totalAcres: dto.totalAcres ?? 5.0,
      },
    });

    await this.prisma.farmMember.create({
      data: { farmId: farm.id, userId: user.id, role: 'OWNER', addedById: user.id },
    });

    await this.prisma.notificationSetting.create({ data: { userId: user.id } });

    const { password: _, ...result } = user;
    const payload = { sub: user.id, email: user.email, role: 'OWNER', farmId: farm.id };
    return {
      access_token: this.jwt.sign(payload),
      user: { ...result, farmId: farm.id, farmName: farm.name },
    };
  }

  async addMember(
    dto: { name: string; email: string; password: string; phone?: string; role?: string },
    requestingUserId: string,
  ) {
    const requesterMembership = await this.prisma.farmMember.findFirst({
      where: { userId: requestingUserId, role: { in: ['OWNER', 'MANAGER'] } },
    });
    if (!requesterMembership) {
      throw new ForbiddenException('Only farm owners and managers can add members');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      const alreadyMember = await this.prisma.farmMember.findUnique({
        where: { farmId_userId: { farmId: requesterMembership.farmId, userId: existingUser.id } },
      });
      if (alreadyMember) throw new ConflictException('This user is already a member of your farm');

      const memberRole = (dto.role as any) || 'WORKER';
      await this.prisma.farmMember.create({
        data: { farmId: requesterMembership.farmId, userId: existingUser.id, role: memberRole, addedById: requestingUserId },
      });
      return { message: 'Existing user added to farm', userId: existingUser.id };
    }

    const hashed = await bcrypt.hash(dto.password, 12);
    const memberRole = (dto.role as any) || 'WORKER';
    const newUser = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed, phone: dto.phone, role: memberRole },
    });

    await this.prisma.farmMember.create({
      data: { farmId: requesterMembership.farmId, userId: newUser.id, role: memberRole, addedById: requestingUserId },
    });

    await this.prisma.notificationSetting.upsert({
      where: { userId: newUser.id },
      update: {},
      create: { userId: newUser.id },
    });

    const { password: _, ...result } = newUser;
    return { message: 'Member created and added to farm', user: result };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const membership = await this.prisma.farmMember.findFirst({
      where: { userId },
      include: { farm: { select: { id: true, name: true, location: true, totalAcres: true } } },
    });

    return {
      ...user,
      farmId: membership?.farmId ?? null,
      farm: membership?.farm ?? null,
      memberRole: membership?.role ?? null,
    };
  }
}
