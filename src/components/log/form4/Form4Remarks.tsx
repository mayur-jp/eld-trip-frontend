import type { DutyEntry } from "@/types/log";

type Box = {
  x0: number;
  y0: number;
  width: number;
  height: number;
};

interface Form4RemarksProps {
  dutyEntries: DutyEntry[];
  box: Box;
}

export function Form4Remarks({ dutyEntries, box }: Form4RemarksProps) {
  const entries = dutyEntries.filter((e) => (e.location || "").trim() || (e.remarks || "").trim());
  if (entries.length === 0) return null;

  const maxLines = Math.max(1, Math.floor(box.height / 16));
  const lineH = Math.max(14, box.height / maxLines);

  return (
    <g>
      {entries.slice(0, maxLines).map((e, i) => {
        const time = e.startTime.slice(11, 16);
        const detail = [e.location, e.remarks].filter(Boolean).join(" — ");
        return (
          <text
            key={`${time}-${i}`}
            x={box.x0 + 10}
            y={box.y0 + 24 + i * lineH}
            fontSize={10.5}
            fill="#111827"
            fontFamily="Arial, sans-serif"
          >
            — {time}, {detail}
          </text>
        );
      })}
    </g>
  );
}

