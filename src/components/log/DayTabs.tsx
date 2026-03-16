import type { DailyLog } from "@/types/log";
import { formatDateString } from "@/lib/formatTime";
import { Tabs } from "@/components/ui/Tabs";

interface DayTabsProps {
  logs: DailyLog[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export function DayTabs({ logs, selectedDayIndex, onSelectDay }: DayTabsProps) {
  const tabs = logs.map((log, i) => ({
    label: `Day ${log.dayNumber} — ${formatDateString(log.date)}`,
    value: String(i),
  }));

  return (
    <Tabs
      tabs={tabs}
      activeTab={String(selectedDayIndex)}
      onTabChange={(value) => onSelectDay(Number(value))}
    />
  );
}
