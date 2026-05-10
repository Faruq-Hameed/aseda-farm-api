import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HarvestsService, CreateHarvestDto, UpdateHarvestDto } from './harvests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('harvests')
@UseGuards(JwtAuthGuard)
export class HarvestsController {
  constructor(private harvestsService: HarvestsService) {}

  @Get()
  findAll(@Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.findSuckerHarvests(req.user.farmId);
    return this.harvestsService.findBunchHarvests(req.user.farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.findOneSucker(id, req.user.farmId);
    return this.harvestsService.findOneBunch(id, req.user.farmId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  create(@Body() dto: CreateHarvestDto, @Request() req: any) {
    if (dto.type === 'sucker') return this.harvestsService.createSuckerHarvest(dto, req.user.farmId, req.user.userId);
    return this.harvestsService.createBunchHarvest(dto, req.user.farmId, req.user.userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  update(@Param('id') id: string, @Body() dto: UpdateHarvestDto, @Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.updateSucker(id, dto, req.user.farmId, req.user.userId);
    return this.harvestsService.updateBunch(id, dto, req.user.farmId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  remove(@Param('id') id: string, @Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.removeSucker(id, req.user.farmId, req.user.userId);
    return this.harvestsService.removeBunch(id, req.user.farmId, req.user.userId);
  }
}
