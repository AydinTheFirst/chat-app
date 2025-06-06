import { Expose, instanceToPlain, plainToInstance, Type } from 'class-transformer';

export abstract class BaseModel {
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  id: string;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  static fromJSON<T>(this: new (...args: unknown[]) => T, obj: object): T {
    return plainToInstance(this, obj, { excludeExtraneousValues: true });
  }

  toJSON() {
    return instanceToPlain(this);
  }

  // Gerekirse validate vb. methodlar eklenebilir
}
