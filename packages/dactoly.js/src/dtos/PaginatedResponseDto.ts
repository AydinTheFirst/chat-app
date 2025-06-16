import { Type } from 'class-transformer';

export class PaginatedResponseDto<T> {
  @Type(() => Object)
  items: T[];

  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}
