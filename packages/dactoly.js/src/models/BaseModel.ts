import { instanceToPlain, plainToInstance, Type } from 'class-transformer';

export abstract class BaseModel {
  @Type(() => Date)
  createdAt: Date;

  id: string;

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
