import { Test, TestingModule } from '@nestjs/testing';
import { ChienController } from './chien.controller';
import { ChienService } from './chien.service';

describe('ChienController', () => {
  let controller: ChienController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChienController],
      providers: [ChienService],
    }).compile();

    controller = module.get<ChienController>(ChienController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
