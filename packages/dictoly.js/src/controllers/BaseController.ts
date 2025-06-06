import { AxiosPromise } from 'axios';
import { plainToInstance } from 'class-transformer';

export class BaseController {
  async transformArray<T>(promise: AxiosPromise<T>, cls: new () => T): Promise<T[]> {
    const { data } = await promise;
    return plainToInstance(cls, data) as T[];
  }

  async transformSingle<T>(promise: AxiosPromise<T>, cls: new () => T): Promise<T> {
    const { data } = await promise;
    return plainToInstance(cls, data);
  }
}
