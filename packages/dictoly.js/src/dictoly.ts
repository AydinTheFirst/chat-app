import { AxiosInstance } from 'axios';

import { ChannelsController, FriendshipController, MessagesController } from '~/controllers';
import * as http from '~/lib/http';

export class DictolyClient {
  public channels = new ChannelsController(this);
  public friendships = new FriendshipController(this);
  public messages = new MessagesController(this);

  // eslint-disable-next-line perfectionist/sort-classes
  public http: AxiosInstance;

  constructor(token: string, baseURL?: string) {
    this.http = http.createInstance(token, baseURL);
  }
}
