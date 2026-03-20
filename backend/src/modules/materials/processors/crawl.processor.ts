import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CrawlerRegistry } from '../crawlers/crawler.registry';
import { RssCrawlerService } from '../crawlers/rss.crawler';
import { JinaReaderService } from '../crawlers/jina-reader.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SystemLogsService } from '../../system-logs/system-logs.service';

@Processor('crawl-queue')
export class CrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(CrawlProcessor.name);

  constructor(
    private crawlerRegistry: CrawlerRegistry,
    private rssCrawler: RssCrawlerService,
    private jinaReader: JinaReaderService,
    private prisma: PrismaService,
    private systemLogsService: SystemLogsService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    const { sourceId, sourceName, sourceUrl, sourceType, platform } = job.data;
    this.logger.log(`开始处理采集任务: ${sourceName} (platform: ${platform})`);

    try {
      let results;

      // 根据 platform 从注册中心获取对应采集器
      const crawler = this.crawlerRegistry.getCrawler(platform);

      if (crawler) {
        // 使用专用采集器
        results = await crawler.crawl(sourceUrl, job.data.config);
      } else if (sourceType === 'rss') {
        // 回退到 RSS 采集器
        results = await this.rssCrawler.crawl(sourceUrl, platform);
      } else {
        this.logger.warn(`未找到 platform=${platform} 的采集器，跳过`);
        return { sourceName, total: 0, saved: 0 };
      }

      // 保存结果（去重）
      const { savedCount, createdMaterialIds } = await this.rssCrawler.saveResults(results);

      // 采集完成后立即为新素材尝试补齐真实图片，提升后续文章生成时的原图命中率
      if (createdMaterialIds.length > 0) {
        const imageResult = await this.rssCrawler.extractImagesForMaterialIds(createdMaterialIds);
        this.logger.log(`新素材图片补提完成: 处理 ${imageResult.processed} 条，成功 ${imageResult.success} 条`);
      }

      // 可选：对没有 content 的素材用 Jina Reader 提取全文
      // （暂不默认启用，避免大量请求 Jina）

      // 更新信息源的最后采集时间
      if (sourceId) {
        await this.prisma.source.update({
          where: { id: sourceId },
          data: { lastCrawlTime: new Date() },
        });
      }

      this.logger.log(`采集任务完成: ${sourceName}, 获取 ${results.length} 条, 新增 ${savedCount} 条`);
      await this.systemLogsService.record(`✅ 渠道【${sourceName}】采集完成: 共拉取素材 ${results.length} 篇，入库 ${savedCount} 篇`, 'success');
      return { sourceName, total: results.length, saved: savedCount };
    } catch (error: any) {
      this.logger.error(`采集任务失败: ${sourceName}`, error);
      await this.systemLogsService.record(`❌ 渠道【${sourceName}】采集失败: ${error.message || '未知错误'}`, 'error');
      throw error;
    }
  }
}
