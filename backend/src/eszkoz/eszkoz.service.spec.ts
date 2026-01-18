import { Test, TestingModule } from '@nestjs/testing';
import { EszkozService } from './eszkoz.service';

describe('EszkozService', () => {
  let service: EszkozService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EszkozService],
    }).compile();

    service = module.get<EszkozService>(EszkozService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
