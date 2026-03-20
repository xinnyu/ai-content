import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        heroui({
            themes: {
                light: {
                    colors: {
                        background: "#F5F5F7", // 略带灰度的背景，比纯白更有质感
                        foreground: "#11181C",
                        primary: {
                            50: "#e6f1fe",
                            100: "#cce3fd",
                            200: "#99c7fb",
                            300: "#66aaf9",
                            400: "#338ef7",
                            500: "#006FEE", // HeroUI standard primary
                            600: "#005bc4",
                            700: "#004493",
                            800: "#002e62",
                            900: "#001731",
                            DEFAULT: "#006FEE",
                            foreground: "#ffffff",
                        },
                        focus: "#006FEE",
                    },
                },
                dark: {
                    colors: {
                        background: "#000000", // 保持纯黑作为基础，靠 CSS 径向渐变来做空间感
                        foreground: "#ECEDEE",
                        // 卡片底色调整，增加与纯黑背景的区别度
                        content1: "#18181b", // zinc-900 (卡片主要颜色)
                        content2: "#27272a", // zinc-800
                        content3: "#3f3f46", // zinc-700
                        content4: "#52525b", // zinc-600
                        primary: {
                            50: "#001731",
                            100: "#002e62",
                            200: "#004493",
                            300: "#005bc4",
                            400: "#006FEE",
                            500: "#004493", // 在深色模式下按钮可以稍微暗一点或者保持明亮
                            600: "#338ef7",
                            700: "#66aaf9",
                            800: "#99c7fb",
                            900: "#cce3fd",
                            DEFAULT: "#006FEE", // 蓝色原色
                            foreground: "#ffffff",
                        },
                        focus: "#338ef7",
                    },
                },
            },
        }),
    ],
};

export default config;
