import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PublishingService } from './publishing.service';

@Controller('publishing')
export class PublishingController {
    constructor(private readonly publishingService: PublishingService) { }

    // ---- 账号管理 API ----

    @Get('accounts')
    async getAccounts() {
        return this.publishingService.getAccounts();
    }

    @Post('accounts')
    async createAccount(@Body() dto: any) {
        return this.publishingService.createAccount(dto);
    }

    @Put('accounts/:id')
    async updateAccount(@Param('id') id: string, @Body() dto: any) {
        return this.publishingService.updateAccount(id, dto);
    }

    @Delete('accounts/:id')
    async deleteAccount(@Param('id') id: string) {
        return this.publishingService.deleteAccount(id);
    }

    // ---- 发布操作 API ----

    @Post('publish')
    async publishArticle(@Body() dto: { articleId: string; accountId: string }) {
        return this.publishingService.publishArticle(dto.articleId, dto.accountId);
    }

    @Get('records/:articleId')
    async getRecords(@Param('articleId') articleId: string) {
        return this.publishingService.getRecordsByArticle(articleId);
    }
}
