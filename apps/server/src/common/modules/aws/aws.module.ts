import { DynamicModule, Module } from '@nestjs/common';

import { S3Service } from './s3.service';

@Module({})
export class AwsModule {
  static forRoot(): DynamicModule {
    const isAwsConfigured = !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

    return {
      exports: isAwsConfigured ? [S3Service] : [],
      module: AwsModule,
      providers: isAwsConfigured ? [S3Service] : [],
    };
  }
}
