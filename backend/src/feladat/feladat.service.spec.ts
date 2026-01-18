import { Test, TestingModule } from '@nestjs/testing';
import { FeladatService } from './feladat.service';

describe('FeladatService', () => {
  let service: FeladatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeladatService],
    }).compile();

    service = module.get<FeladatService>(FeladatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
