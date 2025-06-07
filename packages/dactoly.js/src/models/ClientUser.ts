import { DactolyClient } from '~/dactoly';

import { User } from './User';

export class ClientUser extends User {
  constructor(protected client: DactolyClient) {
    super();
  }
}
