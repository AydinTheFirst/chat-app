import { Type } from 'class-transformer';

export class BaseQueryDto {
  fields?: string;

  @Type(() => Number)
  limit?: number = 10;

  @Type(() => Number)
  offset?: number = 0;

  order?: 'asc' | 'desc' = 'desc';

  search?: string;

  sort?: string = 'createdAt';
}
