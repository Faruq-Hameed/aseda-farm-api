import { Controller, Post, UseGuards, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('seed')
export class SeedController {
  constructor(
    private seedService: SeedService,
    private config: ConfigService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  seed() {
    if (this.config.get('NODE_ENV') === 'production') {
      return { error: 'Not allowed in production' };
    }
    return this.seedService.seed();
  }
}
