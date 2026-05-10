import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.membersService.findAll(req.user.farmId);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  updateRole(@Param('id') id: string, @Body() dto: UpdateMemberDto, @Request() req: any) {
    return this.membersService.updateRole(id, dto, req.user.farmId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.membersService.remove(id, req.user.farmId, req.user.userId);
  }

  @Get('audit/activities')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  getActivities(@Request() req: any, @Query('userId') userId?: string) {
    return this.membersService.getActivityLog(req.user.farmId, userId);
  }

  @Get('audit/changes')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  getChanges(@Request() req: any, @Query('userId') userId?: string) {
    return this.membersService.getChangeLog(req.user.farmId, userId);
  }
}
