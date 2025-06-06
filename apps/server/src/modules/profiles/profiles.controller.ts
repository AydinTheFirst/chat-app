import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { UpdateProfileDto } from './profiles.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  getMyProfile(@GetUser('id') userId: string) {
    return this.profilesService.getMyProfile(userId);
  }

  @Get(':userId')
  getProfileByUserId(@GetUser('id') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  @Patch('me')
  updateMyProfile(@GetUser('id') userId: string, @Body() profile: UpdateProfileDto) {
    return this.profilesService.updateMyProfile(userId, profile);
  }
}
