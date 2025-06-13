import { AxiosPromise } from 'axios';
import { plainToInstance } from 'class-transformer';

import { PaginatedResponseDto } from '~/dtos/PaginatedResponseDto';

export class BaseController {
  async transformArray<T>(promise: AxiosPromise<T>, cls: new () => T): Promise<T[]> {
    const { data } = await promise;
    return plainToInstance(cls, data) as T[];
  }

  async transformPaginated<T>(
    promise: AxiosPromise<PaginatedResponseDto<unknown>>,
    cls: new () => T,
  ): Promise<PaginatedResponseDto<T>> {
    const { data } = await promise;
    return {
      ...data,
      data: plainToInstance(cls, data.data),
    };
  }

  async transformSingle<T>(promise: AxiosPromise<T>, cls: new () => T): Promise<T> {
    const { data } = await promise;
    return plainToInstance(cls, data);
  }
}
