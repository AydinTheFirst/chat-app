export class QueryService<T> {
  constructor(private prismaModel: any) {}

  buildPrismaQuery(
    query: {
      fields?: string;
      include?: Record<string, boolean | object>; // burası include için
      limit?: number;
      offset?: number;
      order?: 'asc' | 'desc';
      search?: string;
      sort?: string;
    },
    searchableFields: (keyof T)[] = [],
  ) {
    const { fields, include, limit, offset, order, search, sort } = query;

    const prismaQuery: any = {
      orderBy: { [sort || 'createdAt']: order || 'desc' },
      skip: Number(offset) || undefined,
      take: Number(limit) || undefined,
    };

    if (search && searchableFields.length > 0) {
      prismaQuery.where = {
        OR: searchableFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      };
    }

    if (fields) {
      prismaQuery.select = fields
        .split(',')
        .reduce((acc, key) => ({ ...acc, [key.trim()]: true }), {});
    }

    if (include) {
      prismaQuery.include = include;
    }

    return prismaQuery;
  }

  async queryAll(query: any, searchableFields: (keyof T)[] = [], customWhere: any = {}) {
    const baseQuery = this.buildPrismaQuery(query, searchableFields);

    baseQuery.where = {
      ...(baseQuery.where || {}),
      ...(customWhere || {}),
    };

    const [data, total] = await Promise.all([
      this.prismaModel.findMany(baseQuery),
      this.prismaModel.count({ where: baseQuery.where }),
    ]);

    return {
      data,
      meta: {
        page: Math.floor((baseQuery.skip ?? 0) / (baseQuery.take ?? 10)) + 1,
        pageCount: Math.ceil(total / (baseQuery.take ?? 10)),
        total,
      },
    };
  }
}
