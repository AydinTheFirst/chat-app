import { ClassConstructor, plainToInstance } from 'class-transformer';

import { Client } from '~/client';
import { BaseModel } from '~/models';

export interface PageBasedResponse<T> {
  items: T[];
  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}

export class Paginator<T extends BaseModel> {
  public currentPage: number;
  public items: T[];
  public totalItems: number;
  public totalPages: number;

  private readonly limit: number;

  constructor(
    private client: Client,
    private modelClass: ClassConstructor<T>,
    private endpoint: string,
    initialResponse: PageBasedResponse<unknown>,
    limit: number,
  ) {
    this.items = initialResponse.items.map((item) => plainToInstance(this.modelClass, item));

    this.currentPage = initialResponse.meta.page;
    this.totalPages = initialResponse.meta.pageCount;
    this.totalItems = initialResponse.meta.total;
    this.limit = limit;
  }

  async fetchNext(): Promise<null | T[]> {
    if (this.currentPage >= this.totalPages) {
      return null;
    }

    const offset = this.currentPage * this.limit;

    const response = await this.client.api.get<PageBasedResponse<unknown>>(this.endpoint, {
      params: { limit: this.limit, offset },
    });

    const newItems = response.data.items.map((item) => plainToInstance(this.modelClass, item));

    this.items.push(...newItems);
    this.currentPage = response.data.meta.page; // Mevcut sayfayı güncelle

    return newItems;
  }

  async *[Symbol.asyncIterator]() {
    for (const item of this.items) {
      yield item;
    }

    while (this.currentPage < this.totalPages) {
      const newItems = await this.fetchNext();
      if (newItems) {
        for (const item of newItems) {
          yield item;
        }
      }
    }
  }
}
