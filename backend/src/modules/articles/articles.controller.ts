import { Controller, Get, Post, Delete, Param, Query, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';

@ApiTags('文章管理')
@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    @ApiOperation({ summary: '获取文章列表（分页）' })
    findAll(@Query() query: any) {
        return this.articlesService.findAll(query);
    }

    @Post(':topicId/generate')
    @ApiOperation({ summary: '基于选题一键自动化生成图文文章' })
    generateFromTopic(
        @Param('topicId') topicId: string,
        @Query('force') force?: string,
        @Query('contentType') contentType?: 'article' | 'xiaohongshu',
    ) {
        return this.articlesService.generateFromTopic(topicId, force === 'true', contentType === 'xiaohongshu' ? 'xiaohongshu' : 'article');
    }

    @Get(':id')
    @ApiOperation({ summary: '获取单篇文章详情' })
    findOne(@Param('id') id: string) {
        return this.articlesService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新文章' })
    update(@Param('id') id: string, @Body() data: any) {
        return this.articlesService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除文章' })
    remove(@Param('id') id: string) {
        return this.articlesService.remove(id);
    }
}
