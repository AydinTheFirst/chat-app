import { DictolyClient } from '~/dictoly';
import { UserStatus } from '~/types';

import { User } from './User';

export class ClientUser extends User {
  constructor(protected client: DictolyClient) {
    super();
  }

  updateStatus(status: UserStatus) {
    this.client.ws.emit('updateStatus', { status });
  }
}
