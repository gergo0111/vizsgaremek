import { Test, TestingModule } from '@nestjs/testing';
import { EszkozController } from './eszkoz.controller';
import { EszkozService } from './eszkoz.service';

describe('EszkozController', () => {
  let controller: EszkozController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EszkozController],
      providers: [EszkozService],
    }).compile();

    controller = module.get<EszkozController>(EszkozController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
