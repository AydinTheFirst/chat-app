import { instanceToPlain, plainToInstance } from 'class-transformer';

import { Client } from '~/client';

export abstract class BaseModel {
  get client(): Client {
    return Client.instance;
  }

  static fromJSON<T extends BaseModel>(this: new () => T, data: Partial<T>): T {
    const instance = plainToInstance(this, data);
    return instance;
  }

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this, {
      enableCircularCheck: true,
    });
  }
}
