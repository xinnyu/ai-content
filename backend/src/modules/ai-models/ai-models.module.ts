import { Module } from '@nestjs/common';
import { AiPlatformsController } from './ai-platforms.controller';
import { AiPlatformsService } from './ai-platforms.service';
import { AiModelsController } from './ai-models.controller';
import { AiModelsService } from './ai-models.service';
import { DefaultModelsController } from './default-models.controller';
import { DefaultModelsService } from './default-models.service';
import { AiClientService } from './ai-client.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AiPlatformsController, DefaultModelsController, AiModelsController],
  providers: [AiPlatformsService, AiModelsService, DefaultModelsService, AiClientService],
  exports: [AiClientService, AiModelsService, AiPlatformsService, DefaultModelsService],
})
export class AiModelsModule { }
