import { DynamicModule, Module } from '@nestjs/common';

import { NetgsmService } from './netgsm.service';

@Module({})
export class NetgsmModule {
  static forRoot(): DynamicModule {
    const isConfigured = !!process.env.NETGSM_USERCODE;

    return {
      exports: isConfigured ? [NetgsmService] : [],
      module: NetgsmModule,
      providers: isConfigured ? [NetgsmService] : [],
    };
  }
}
