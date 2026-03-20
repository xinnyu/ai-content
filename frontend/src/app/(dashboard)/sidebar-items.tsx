import { type SidebarItem } from "@/components/application/sidebars/Sidebar Responsive/ts/sidebar";
import { Chip } from "@heroui/react";

export const sectionItems: SidebarItem[] = [
    {
        key: "overview",
        title: "内容生产",
        items: [
            {
                key: "/",
                href: "/",
                icon: "solar:home-2-linear",
                title: "工作台",
            },
            {
                key: "/materials",
                href: "/materials",
                icon: "solar:cloud-download-outline",
                title: "素材管理",
            },
            {
                key: "/topics",
                href: "/topics",
                icon: "solar:lightbulb-minimalistic-linear",
                title: "精选选题库",
                endContent: (
                    <Chip size="sm" variant="flat" color="primary">
                        AI
                    </Chip>
                ),
            },
            {
                key: "/articles",
                href: "/articles",
                icon: "solar:document-text-linear",
                title: "我的文章",
            },
            {
                key: "/xiaohongshu",
                href: "/xiaohongshu",
                icon: "solar:chat-round-dots-linear",
                title: "小红书笔记",
            },
            {
                key: "/templates",
                href: "/templates",
                icon: "solar:widget-2-outline",
                title: "文章模板",
            },
        ],
    },
    {
        key: "system",
        title: "系统配置",
        items: [
            {
                key: "/platforms",
                href: "/platforms",
                icon: "solar:users-group-two-rounded-outline",
                title: "平台账号",
            },
            {
                key: "/styles",
                href: "/styles",
                icon: "solar:document-add-linear",
                title: "风格管理",
            },
            {
                key: "/strategies",
                href: "/strategies",
                icon: "solar:target-linear",
                title: "内容策略",
            },
            {
                key: "/schedules",
                href: "/schedules",
                icon: "solar:alarm-outline",
                title: "计划任务",
            },
            {
                key: "/settings",
                href: "/settings",
                icon: "solar:settings-outline",
                title: "配置管理",
            },
        ],
    },
];
