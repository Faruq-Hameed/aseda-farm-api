import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ConfigService } from '@nestjs/config';

@Controller('seed')
export class SeedController {
  constructor(
    private seedService: SeedService,
    private config: ConfigService,
  ) {}

  @Get()
  seed() {
    if (this.config.get('NODE_ENV') === 'production') {
      return { error: 'Not allowed in production' };
    }
    return this.seedService.seed();
  }
}
