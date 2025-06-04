export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    total: number;
  };
}
