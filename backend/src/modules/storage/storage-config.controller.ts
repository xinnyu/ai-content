import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { QiniuService } from './qiniu.service';

@Controller('storage')
export class StorageConfigController {
    constructor(private readonly qiniuService: QiniuService) { }

    /**
     * 读取当前七牛云配置（SecretKey 脱敏返回）
     */
    @Get('config')
    async getConfig() {
        const config = await this.qiniuService.getConfig();
        if (!config) {
            return { accessKey: '', secretKey: '', bucket: '', domain: '' };
        }
        return {
            accessKey: config.accessKey,
            secretKey: config.secretKey ? '********' : '',  // SecretKey 脱敏
            bucket: config.bucket,
            domain: config.domain,
        };
    }

    /**
     * 保存七牛云配置
     */
    @Put('config')
    async updateConfig(@Body() body: {
        accessKey: string;
        secretKey: string;
        bucket: string;
        domain: string;
    }) {
        // 如果 secretKey 传入的是脱敏占位符，不覆盖原始值
        if (body.secretKey === '********') {
            const existing = await this.qiniuService.getConfig();
            body.secretKey = existing?.secretKey || '';
        }
        await this.qiniuService.saveConfig(body);
        return { success: true, message: '七牛云配置已保存' };
    }

    /**
     * 测试七牛云连接
     */
    @Post('config/test')
    async testConnection() {
        return this.qiniuService.testConnection();
    }
}
