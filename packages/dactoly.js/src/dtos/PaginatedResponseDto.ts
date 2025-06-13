export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}
