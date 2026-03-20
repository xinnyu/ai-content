import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  const articlesService = {
    generateFromTopic: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: articlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('会把 contentType 查询参数透传给 service', () => {
    controller.generateFromTopic('topic-1', 'true', 'xiaohongshu');
    expect(articlesService.generateFromTopic).toHaveBeenCalledWith('topic-1', true, 'xiaohongshu');
  });
});
