import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { CreateApplicationDto, UpdateApplicationDto } from './applications.dto';
import { ApplicationsService } from './applications.service';

@Controller('applications')
@UseGuards(AuthGuard)
export class ApplicationsController {
  constructor(private readonly appService: ApplicationsService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateApplicationDto) {
    return this.appService.create(userId, dto);
  }

  @Post(':id/token')
  createToken(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.appService.createToken(userId, id);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.appService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.appService.findOne(userId, id);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.appService.remove(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.appService.update(userId, id, dto);
  }
}
