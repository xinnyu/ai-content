import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSourceDto {
  @ApiProperty({ description: '信息源名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '类型: rss | api | crawler' })
  @IsString()
  type: string;

  @ApiProperty({ description: '采集目标URL' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ description: '额外配置' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
