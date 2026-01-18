import { Test, TestingModule } from '@nestjs/testing';
import { MunkaService } from './munka.service';

describe('MunkaService', () => {
  let service: MunkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MunkaService],
    }).compile();

    service = module.get<MunkaService>(MunkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
