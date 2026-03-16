import type { DutyEntry } from "@/types/log";
import { DUTY_STATUS_LABELS } from "@/constants/dutyStatus";
import { SECTION_SUBTITLE } from "@/lib/styles";

interface LogRemarksProps {
  dutyEntries: DutyEntry[];
}

export function LogRemarks({ dutyEntries }: LogRemarksProps) {
  const entries = dutyEntries.filter(
    (entry) => entry.location || entry.remarks,
  );

  if (entries.length === 0) return null;

  return (
    <div>
      <h3 className={`${SECTION_SUBTITLE} mb-3`}>Remarks</h3>
      <div className="space-y-0">
        {entries.map((entry, i) => {
          const time = entry.startTime.slice(11, 16);
          const statusLabel = DUTY_STATUS_LABELS[entry.status];
          const detail = [entry.location, entry.remarks]
            .filter(Boolean)
            .join(" — ");

          return (
            <p key={i} className="font-mono text-xs text-slate-600 py-1">
              {time} — {statusLabel} — {detail}
            </p>
          );
        })}
      </div>
    </div>
  );
}
