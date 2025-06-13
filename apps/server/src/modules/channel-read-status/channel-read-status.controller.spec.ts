import { Test, TestingModule } from '@nestjs/testing';

import { ChannelReadStatusController } from './channel-read-status.controller';
import { ChannelReadStatusService } from './channel-read-status.service';

describe('ChannelReadStatusController', () => {
  let controller: ChannelReadStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelReadStatusController],
      providers: [ChannelReadStatusService],
    }).compile();

    controller = module.get<ChannelReadStatusController>(ChannelReadStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
