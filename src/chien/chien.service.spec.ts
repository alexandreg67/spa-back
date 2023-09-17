import { Test, TestingModule } from '@nestjs/testing';
import { ChienService } from './chien.service';

describe('ChienService', () => {
  let service: ChienService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChienService],
    }).compile();

    service = module.get<ChienService>(ChienService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
