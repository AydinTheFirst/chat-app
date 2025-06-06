import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { GetUser, Roles } from '~/common/decorators';
import { AuthGuard, RolesGuard } from '~/common/guards';

import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(['ADMIN'])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(['ADMIN'])
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(['ADMIN'])
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id/force')
  @Roles(['ADMIN'])
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete('me')
  removeMe(@GetUser('id') userId: string) {
    return this.usersService.removeMe(userId);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
