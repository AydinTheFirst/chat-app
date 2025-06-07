import { AxiosInstance } from 'axios';

import { ChannelsController, FriendshipController, MessagesController } from '~/controllers';
import { DactolySocket } from '~/events';
import { createInstance, createWebsocket } from '~/lib';
import { DactolyClientConfig } from '~/types';

export class DactolyClient {
  public channels = new ChannelsController(this);
  public friendships = new FriendshipController(this);
  public messages = new MessagesController(this);

  // eslint-disable-next-line perfectionist/sort-classes
  public http: AxiosInstance;
  public ws: DactolySocket;

  constructor(config: DactolyClientConfig) {
    this.http = createInstance(config);
    this.ws = createWebsocket(config);
  }
}
