import { instanceToPlain, plainToInstance, Type } from 'class-transformer';

import { getGlobalClient } from '~/utils/client-factory';

export class BaseModel {
  @Type(() => Date)
  createdAt: Date;

  id: string;

  @Type(() => Date)
  updatedAt: Date;

  get client() {
    return getGlobalClient();
  }

  static fromJSON<T extends BaseModel>(this: new () => T, obj: unknown): T {
    const instance = plainToInstance(this, obj, {
      enableImplicitConversion: true,
    });

    Object.setPrototypeOf(instance, this.prototype);

    return instance;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
