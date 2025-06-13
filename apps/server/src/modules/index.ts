import { AuthModule } from './auth';
import { ChannelReadStatusModule } from './channel-read-status/channel-read-status.module';
import { ChannelsModule } from './channels';
import { FilesModule } from './files/files.module';
import { FriendsModule } from './friendships/friends.module';
import { InvitesModule } from './invites/invites.module';
import { MessagesModule } from './messages/messages.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users';

const Modules = {
  AuthModule,
  ChannelReadStatusModule,
  ChannelsModule,
  FilesModule,
  FriendsModule,
  InvitesModule,
  MessagesModule,
  ProfilesModule,
  TokenModule,
  UsersModule,
};

export default Object.values(Modules);
