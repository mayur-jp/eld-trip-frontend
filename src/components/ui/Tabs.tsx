import type { ReactNode } from "react";

import {
  TABS_CONTAINER,
  TAB_ITEM_ACTIVE,
  TAB_ITEM_INACTIVE,
} from "@/lib/styles";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className={TABS_CONTAINER}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={
            tab.value === activeTab ? TAB_ITEM_ACTIVE : TAB_ITEM_INACTIVE
          }
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  isActive: boolean;
  children: ReactNode;
}

export function TabPanel({ isActive, children }: TabPanelProps) {
  if (!isActive) return null;
  return <div>{children}</div>;
}
