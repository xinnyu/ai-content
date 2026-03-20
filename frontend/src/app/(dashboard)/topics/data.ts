// 前端显示用的类型定义与字段映射
import { Topic as ApiTopic } from '@/lib/api/topics';

export type TopicStatus = "pending" | "generating" | "completed";

export type TopicScore = {
    audienceFit: number;
    emotionalValue: number;
    simplificationPotential: number;
    networkVolume: number;
    contentValue: number;
};

// 前端显示用的 Topic 类型（与 TopicCard 组件字段对应）
export type Topic = {
    id: string;
    title: string;
    sourceType: string;
    score: number;
    details: TopicScore;
    summary: string;
    reasoning: string;
    keywords: string[];
    searchQueries: string[];
    createDate: string;
    status: TopicStatus;
    isPublished?: boolean;
};

// 空评分详情，用于未评估的选题
const emptyScore: TopicScore = { audienceFit: 0, emotionalValue: 0, simplificationPotential: 0, networkVolume: 0, contentValue: 0 };

// 将后端 API 返回的 Topic 映射为前端显示用的 Topic
export function mapApiTopic(apiTopic: ApiTopic): Topic {
    return {
        id: apiTopic.id,
        title: apiTopic.title,
        sourceType: apiTopic.sourceType,
        score: apiTopic.aiScore ?? 0,
        details: apiTopic.scoreDetails ?? emptyScore,
        summary: apiTopic.summary ?? '',
        reasoning: apiTopic.reasoning ?? '',
        keywords: apiTopic.keywords ?? [],
        searchQueries: apiTopic.searchQueries ?? [],
        createDate: apiTopic.createdAt,
        status: apiTopic.status,
        isPublished: apiTopic.isPublished,
    };
}

// 修改 Mock 数据，加入新字段与真实的爆款内容样例
export const topics: Topic[] = [
    {
        id: "1",
        title: "2024 年前端框架发展趋势预测：Next.js 与 React 服务端渲染的深度融合版",
        sourceType: "外部采集",
        score: 92,
        details: { audienceFit: 95, emotionalValue: 88, simplificationPotential: 90, networkVolume: 85, contentValue: 92 },
        summary: "深度剖析全栈框架如何实现服务端渲染，结合最新 React Server Components 特性，为现代企业开发带来显著性能提升的深度解读。",
        reasoning: "极度贴合'有想法没技术的运营'画像。切入点：不要被 Next.js 的高深概念吓到，它本质上就是帮你省掉后端开发人员的利器，完美引出我们的 Cursor/AI 全栈开发极速落地教程。",
        keywords: ["前端架构", "React", "性能优化"],
        searchQueries: ["Next.js 14 新特性", "RSC 最佳实践"],
        createDate: "2024-02-24T10:00:00Z",
        status: "completed",
        isPublished: false,
    },
    {
        id: "2",
        title: "大厂裁员背后的隐秘真相：那些被优化的 P7 都在干什么？",
        sourceType: "知乎热榜",
        score: 97,
        details: { audienceFit: 98, emotionalValue: 100, simplificationPotential: 95, networkVolume: 92, contentValue: 90 },
        summary: "揭秘大厂裁员后的真实去向，探讨中年职场危机与转型副业的必然性，直击当代互联网人的生存焦虑。",
        reasoning: "完美制造焦虑的情绪炸弹！直击'30岁收入见顶准备搞副业的职场人'。钩子：P7被裁后都在悄悄用AI做一人企业，你还在傻傻投简历？引流点极佳。",
        keywords: ["职场危机", "一人企业", "大厂裁员"],
        searchQueries: ["程序员 35岁出路", "AI 一个人怎么赚钱"],
        createDate: "2024-02-23T15:30:00Z",
        status: "completed",
        isPublished: true,
    },
    {
        id: "3",
        title: "DeepSeek 爆火一周后，我用它 0 成本克隆了一个百万粉丝的数字人账号",
        sourceType: "多源聚合",
        score: 88,
        details: { audienceFit: 90, emotionalValue: 85, simplificationPotential: 80, networkVolume: 95, contentValue: 88 },
        summary: "实战演练如何利用最新开源大模型零成本打造爆款数字人 IP，全流程拆解，小白也可快速上手。",
        reasoning: "精准打击'深陷AI焦虑的传统小老板'。核心逻辑：雇佣免费数字员工帮你搞定短视频获客。全网声量极高，是非常好的流量入口。",
        keywords: ["DeepSeek", "数字人", "短视频运营"],
        searchQueries: ["免费数字人工具", "大语言模型开源评测"],
        createDate: "2024-02-22T09:15:00Z",
        status: "pending",
        isPublished: false,
    }
];
