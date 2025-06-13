import { Test, TestingModule } from '@nestjs/testing';

import { ChannelReadStatusService } from './channel-read-status.service';

describe('ChannelReadStatusService', () => {
  let service: ChannelReadStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelReadStatusService],
    }).compile();

    service = module.get<ChannelReadStatusService>(ChannelReadStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
