import { Test, TestingModule } from '@nestjs/testing';
import { FeladatController } from './feladat.controller';
import { FeladatService } from './feladat.service';

describe('FeladatController', () => {
  let controller: FeladatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeladatController],
      providers: [FeladatService],
    }).compile();

    controller = module.get<FeladatController>(FeladatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
