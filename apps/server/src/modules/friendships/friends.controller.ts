import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { CreateFriendRequestDto, UpdateFriendRequestDto } from './friends.dto';
import { FriendsService } from './friends.service';

@Controller('friendships')
@UseGuards(AuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post(':id/accept')
  acceptFriendRequest(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.friendsService.acceptFriendRequest(id, userId);
  }

  @Post()
  create(@Body() createFriendDto: CreateFriendRequestDto, @GetUser('id') userId: string) {
    return this.friendsService.create(createFriendDto, userId);
  }

  @Post(':id/reject')
  declineFriendRequest(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.friendsService.rejectFriendRequest(id, userId);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.friendsService.findAll(userId);
  }

  @Get('pending')
  findPendingRequests(@GetUser('id') userId: string) {
    return this.friendsService.findPendingRequests(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.friendsService.remove(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFriendDto: UpdateFriendRequestDto,
    @GetUser('id') userId: string,
  ) {
    return this.friendsService.update(id, updateFriendDto, userId);
  }
}
