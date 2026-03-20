// Dashboard 统计 API
import { api } from './client';

export interface DashboardStats {
  collection: {
    todayCount: number;
    successRate: string;
  };
  pendingDraftArticles: number;
  topKeyword: string;
  articles: {
    todayCount: number;
    totalCount: number;
  };
}

export interface TrendDataPoint {
  date: string;
  total: number;
  [platform: string]: string | number; // 动态平台字段
}

export interface SystemLog {
  id: string;
  level: string;
  content: string;
  createdAt: string;
}

export interface KeywordData {
  text: string;
  value: number;
}

export interface KeywordMatrix {
  highValueKeywords: KeywordData[];
  trendingMaterialKeywords: KeywordData[];
}

export interface DraftArticle {
  id: string;
  title: string;
  topicTitle?: string | null;
  templateName?: string | null;
  contentFormat: string;
  keywords: string[];
  createdAt: string;
}

export const dashboardApi = {
  // 核心指标统计 (新版)
  stats() {
    return api.get<DashboardStats>('/dashboard/stats');
  },

  // 采集趋势
  collectionTrends(days: number = 7) {
    return api.get<TrendDataPoint[]>(`/dashboard/collection-trends?days=${days}`);
  },

  // 创作趋势
  creationTrends(days: number = 7) {
    return api.get<TrendDataPoint[]>(`/dashboard/creation-trends?days=${days}`);
  },

  // 关键词矩阵
  keywordMatrix() {
    return api.get<KeywordMatrix>('/dashboard/keyword-matrix');
  },

  // 最新待发布草稿
  draftArticles(limit: number = 5) {
    return api.get<DraftArticle[]>(`/dashboard/draft-articles?limit=${limit}`);
  },

  // 系统运行日志
  systemLogs(limit: number = 50) {
    return api.get<SystemLog[]>(`/dashboard/system-logs?limit=${limit}`);
  },
};
