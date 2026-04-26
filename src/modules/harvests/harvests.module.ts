import { Module } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { HarvestsController } from './harvests.controller';

@Module({
  providers: [HarvestsService],
  controllers: [HarvestsController],
})
export class HarvestsModule {}
