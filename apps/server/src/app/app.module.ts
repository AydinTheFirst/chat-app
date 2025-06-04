import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

import { AwsModule, NetgsmModule } from '~/common/modules';
import { multerConfig, serveStaticConfig, throttlerConfig } from '~/config';
import { PrismaModule } from '~/database';
import modules from '~/modules';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ...modules,
    PrismaModule,
    AwsModule.forRoot(),
    NetgsmModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(throttlerConfig),
    ServeStaticModule.forRoot(serveStaticConfig),
    MulterModule.register(multerConfig),
  ],
  providers: [],
})
export class AppModule {}
