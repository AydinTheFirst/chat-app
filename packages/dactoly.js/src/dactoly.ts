import { AxiosInstance } from 'axios';

import {
  ChannelsController,
  FriendshipController,
  MessagesController,
  ReadStatusController,
} from '~/controllers';
import { DactolySocket } from '~/events';
import { createInstance, createWebsocket } from '~/lib';
import { DactolyClientConfig } from '~/types';

export class DactolyClient {
  public channels = new ChannelsController(this);
  public friendships = new FriendshipController(this);
  public messages = new MessagesController(this);
  public readStatus = new ReadStatusController(this);

  // eslint-disable-next-line perfectionist/sort-classes
  public http: AxiosInstance;
  public ws: DactolySocket;

  constructor(config: DactolyClientConfig) {
    this.http = createInstance(config);
    this.ws = createWebsocket(config);
  }
}
