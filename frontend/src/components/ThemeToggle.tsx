"use client";

import React from "react";
import { Button, Tooltip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
    isCompact?: boolean;
}

const noopSubscribe = () => () => undefined;

export function ThemeToggle({ isCompact }: ThemeToggleProps) {
    const mounted = React.useSyncExternalStore(noopSubscribe, () => true, () => false);
    const { theme, setTheme } = useTheme();
    const isDark = mounted && theme === "dark";

    return (
        <Tooltip content={isDark ? "切换为浅色模式" : "切换为深色模式"} isDisabled={!isCompact} placement="right">
            <Button
                className={cn(
                    "text-default-500 data-[hover=true]:text-foreground justify-start truncate",
                    {
                        "justify-center": isCompact,
                    }
                )}
                isIconOnly={isCompact}
                startContent={
                    isCompact ? null : (
                        <Icon
                            className="text-default-500 flex-none"
                            icon={isDark ? "solar:sun-bold" : "solar:moon-bold"}
                            width={24}
                        />
                    )
                }
                variant="light"
                onClick={() => setTheme(isDark ? "light" : "dark")}
            >
                {isCompact ? (
                    <Icon
                        className="text-default-500"
                        icon={isDark ? "solar:sun-bold" : "solar:moon-bold"}
                        width={24}
                    />
                ) : (
                    isDark ? "浅色模式" : "深色模式"
                )}
            </Button>
        </Tooltip>
    );
}
