import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HarvestsService, CreateHarvestDto, UpdateHarvestDto } from './harvests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('harvests')
@UseGuards(JwtAuthGuard)
export class HarvestsController {
  constructor(private harvestsService: HarvestsService) {}

  @Get()
  findAll(@Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.findSuckerHarvests(req.user.userId);
    return this.harvestsService.findBunchHarvests(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.findOneSucker(id, req.user.userId);
    return this.harvestsService.findOneBunch(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateHarvestDto, @Request() req: any) {
    if (dto.type === 'sucker') return this.harvestsService.createSuckerHarvest(dto, req.user.userId);
    return this.harvestsService.createBunchHarvest(dto, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHarvestDto, @Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.updateSucker(id, dto, req.user.userId);
    return this.harvestsService.updateBunch(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any, @Query('type') type?: string) {
    if (type === 'sucker') return this.harvestsService.removeSucker(id, req.user.userId);
    return this.harvestsService.removeBunch(id, req.user.userId);
  }
}
