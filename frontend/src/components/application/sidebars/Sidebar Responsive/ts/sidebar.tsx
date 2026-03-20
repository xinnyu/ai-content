"use client";

import {
  Accordion,
  AccordionItem,
  cn,
  Listbox,
  ListboxItem,
  ListboxSection,
  Tooltip,
  type ListboxProps,
  type ListboxSectionProps,
  type Selection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps["classNames"];
  classNames?: ListboxProps["classNames"];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      defaultSelectedKey,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey);

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, "w-full", {
        "p-0 max-w-[44px]": isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        "flex flex-col gap-1": isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        "w-11 h-11 gap-0 p-0": isCompact,
      }),
    };

    const renderIcon = (item: SidebarItem) => {
      if (item.icon) {
        return (
          <Icon
            className={cn(
              "text-default-500 group-data-[selected=true]:text-foreground",
              iconClassName,
            )}
            icon={item.icon}
            width={24}
          />
        );
      }

      return item.startContent ?? null;
    };

    const renderCompactContent = (item: SidebarItem) => (
      <Tooltip content={item.title} placement="right">
        <div className="flex w-full items-center justify-center">{renderIcon(item)}</div>
      </Tooltip>
    );

    const renderStandardItem = (item: SidebarItem) => (
      <ListboxItem
        {...item}
        key={item.key}
        endContent={isCompact || hideEndContent ? null : (item.endContent ?? null)}
        startContent={isCompact ? null : renderIcon(item)}
        textValue={item.title}
        title={isCompact ? null : item.title}
      >
        {isCompact ? renderCompactContent(item) : null}
      </ListboxItem>
    );

    const renderNestedItem = (item: SidebarItem) => {
      const nestedItems = item.items ?? [];
      const nestedListItem = { ...item, href: undefined };

      return (
        <ListboxItem
          {...nestedListItem}
          key={item.key}
          classNames={{
            base: cn(
              {
                "h-auto p-0": !isCompact,
              },
              {
                "inline-block w-11": isCompact,
              },
            ),
          }}
          endContent={null}
          startContent={null}
          title={isCompact ? null : item.title}
        >
          {isCompact ? renderCompactContent(item) : null}
          {!isCompact ? (
            <Accordion className="p-0">
              <AccordionItem
                key={item.key}
                aria-label={item.title}
                classNames={{
                  heading: "pr-3",
                  trigger: "p-0",
                  content: "py-0 pl-4",
                }}
                title={
                  item.icon ? (
                    <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                      {renderIcon(item)}
                      <span className="text-small font-medium text-default-500 group-data-[selected=true]:text-foreground">
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    item.startContent ?? null
                  )
                }
              >
                <Listbox
                  className="mt-0.5"
                  classNames={{
                    list: cn("border-l border-default-200 pl-4"),
                  }}
                  items={nestedItems}
                  variant="flat"
                >
                  {nestedItems.map(renderItem)}
                </Listbox>
              </AccordionItem>
            </Accordion>
          ) : null}
        </ListboxItem>
      );
    };

    const renderItem = (item: SidebarItem) => {
      const isNestType =
        item.items && item.items.length > 0 && item.type === SidebarItemType.Nest;

      if (isNestType) {
        return renderNestedItem(item);
      }

      return renderStandardItem(item);
    };

    return (
      <Listbox
        suppressHydrationWarning
        key={isCompact ? "compact" : "default"}
        ref={ref}
        hideSelectedIcon
        as="nav"
        className={cn("list-none", className)}
        classNames={{
          ...classNames,
          list: cn("items-center", classNames?.list),
        }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn(
            "min-h-11 h-[44px] rounded-large px-3 data-[selected=true]:bg-default-100",
            itemClasses?.base,
          ),
          title: cn(
            "text-small font-medium text-default-500 group-data-[selected=true]:text-foreground",
            itemClasses?.title,
          ),
        }}
        items={items}
        selectedKeys={[selected] as unknown as Selection}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];

          setSelected(key as React.Key);
          onSelect?.(key as string);
        }}
        {...props}
      >
        {(item) => {
          const sectionItems = item.items ?? [];
          const isNestType =
            sectionItems.length > 0 && item.type === SidebarItemType.Nest;

          if (isNestType) {
            return renderNestedItem(item);
          }

          if (sectionItems.length > 0) {
            return (
              <ListboxSection
                key={item.key}
                classNames={sectionClasses}
                showDivider={isCompact}
                title={item.title}
              >
                {sectionItems.map(renderItem)}
              </ListboxSection>
            );
          }

          return renderStandardItem(item);
        }}
      </Listbox>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
