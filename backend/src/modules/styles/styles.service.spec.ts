import { Test, TestingModule } from '@nestjs/testing';
import { StylesService } from './styles.service';

describe('StylesService', () => {
  let service: StylesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StylesService],
    }).compile();

    service = module.get<StylesService>(StylesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
