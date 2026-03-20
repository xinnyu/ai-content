import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { MaterialsModule } from '../materials/materials.module';
import { TopicsModule } from '../topics/topics.module';
import { ArticlesModule } from '../articles/articles.module';
import { PublishingModule } from '../publishing/publishing.module';

@Module({
    imports: [
        MaterialsModule,
        TopicsModule,
        ArticlesModule,
        PublishingModule,
    ],
    controllers: [SchedulesController],
    providers: [SchedulesService],
})
export class SchedulesModule { }
