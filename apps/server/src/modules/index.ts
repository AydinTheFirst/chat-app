import { AuthModule } from './auth';
import { ChannelsModule } from './channels';
import { FriendsModule } from './friendships/friends.module';
import { InvitesModule } from './invites/invites.module';
import { MessagesModule } from './messages/messages.module';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users';

const Modules = {
  AuthModule,
  ChannelsModule,
  FriendsModule,
  InvitesModule,
  MessagesModule,
  TokenModule,
  UsersModule,
};

export default Object.values(Modules);
