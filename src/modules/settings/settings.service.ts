import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

export { UpdateSettingsDto };

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(userId: string) {
    const settings = await this.prisma.notificationSetting.findUnique({ where: { userId } });
    if (!settings) {
      return this.prisma.notificationSetting.create({ data: { userId } });
    }
    return settings;
  }

  async update(userId: string, dto: UpdateSettingsDto) {
    return this.prisma.notificationSetting.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
