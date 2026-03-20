import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { StorageConfigController } from './storage-config.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [StorageConfigController],
    providers: [QiniuService],
    exports: [QiniuService],  // 导出供 AiModelsModule 注入使用
})
export class StorageModule { }
