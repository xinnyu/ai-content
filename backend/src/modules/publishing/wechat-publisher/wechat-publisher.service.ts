import { Injectable, Logger } from '@nestjs/common';
import { WechatCompiler } from './wechat-compiler';

export interface WechatPublishParams {
    apiToken: string;
    authorizerAppid: string;
    apiUrl: string;
    title: string;
    markdownContent?: string;
    htmlContent?: string;
    coverUrl?: string;
    categoryId?: number;
    needOpenComment?: number;
    onlyFansCanComment?: number;
    author?: string;
    openComment?: number;
    openReward?: number;
}

@Injectable()
export class WechatPublisherService {
    private readonly logger = new Logger(WechatPublisherService.name);

    async publish(params: WechatPublishParams): Promise<{ articleId: string; publishUrl?: string }> {
        try {
            // 1. 优先使用已渲染好的 HTML；旧文章仍兼容 Markdown 编译
            const htmlContent = params.htmlContent
                ? params.htmlContent
                : await WechatCompiler.compile(params.markdownContent || '');

            // 2. 调用配置设定的 API 发文
            const response = await fetch(params.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${params.apiToken} `,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    authorizer_appid: params.authorizerAppid,
                    title: params.title,
                    content: htmlContent,
                    author: params.author || '',
                    cover_url: params.coverUrl || '',
                    open_comment: params.openComment,
                    open_reward: params.openReward,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'API 请求失败');
            }

            return {
                articleId: String(data.data.articleId || data.data.article_id),
            };

        } catch (error) {
            this.logger.error(`Failed to publish to WeChat: ${error.message} `);
            throw error;
        }
    }
}
