import { AxiosInstance } from 'axios';
import { plainToClass } from 'class-transformer';
import EventEmitter from 'events';

import {
  ChannelsController,
  FriendshipController,
  MessagesController,
  ReadStatusController,
} from '~/controllers';
import { DactolySocket } from '~/events';
import { createInstance, createWebsocket } from '~/lib';
import { DactolyClientConfig } from '~/types';
import { setGlobalClient } from '~/utils/client-factory';

import { ClientUser } from './models';

export class DactolyClient extends EventEmitter {
  public channels = new ChannelsController(this);
  public friendships = new FriendshipController(this);
  public messages = new MessagesController(this);
  public readStatus = new ReadStatusController(this);

  public user: ClientUser;

  // eslint-disable-next-line perfectionist/sort-classes
  public http: AxiosInstance;
  public ws: DactolySocket;

  constructor(config: DactolyClientConfig) {
    super();
    this.http = createInstance(config);
    this.ws = createWebsocket(this, config);
    setGlobalClient(this);
  }

  public async login(): Promise<ClientUser> {
    const response = await this.http.get<ClientUser>('/profiles/me');
    const user = plainToClass(ClientUser, response.data);
    this.user = user;
    this.ws.connect();
    return user;
  }
}
