import { AxiosInstance } from 'axios';
import { Socket } from 'socket.io-client';

import { ChannelsController, FriendshipController, MessagesController } from '~/controllers';
import { createInstance } from '~/lib';

import { createWebsocket } from './lib/socket';

export class DictolyClient {
  public channels = new ChannelsController(this);
  public friendships = new FriendshipController(this);
  public messages = new MessagesController(this);

  // eslint-disable-next-line perfectionist/sort-classes
  public http: AxiosInstance;
  public ws: Socket;

  constructor(token: string, baseURL?: string) {
    console.log('Hello world');

    this.http = createInstance(token, baseURL);
    this.ws = createWebsocket(token, baseURL);
  }
}
