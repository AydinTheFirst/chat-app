import { AuthModule } from './auth';
import { ChannelsModule } from './channels';
import { MessagesModule } from './messages/messages.module';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users';

const Modules = {
  AuthModule,
  ChannelsModule,
  MessagesModule,
  TokenModule,
  UsersModule,
};

export default Object.values(Modules);
