import { Test, TestingModule } from '@nestjs/testing';
import { MunkaController } from './munka.controller';
import { MunkaService } from './munka.service';

describe('MunkaController', () => {
  let controller: MunkaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MunkaController],
      providers: [MunkaService],
    }).compile();

    controller = module.get<MunkaController>(MunkaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
