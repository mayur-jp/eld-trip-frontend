import type { DailyLog } from "@/types/log";

import { formatDateString } from "@/lib/formatTime";
import { FORM4, FORM4_COLORS, FORM4_REMARKS, FORM4_STROKES } from "./form4Constants";
import { Form4DutyPath } from "./Form4DutyPath";

interface Form4DailyLogSheetProps {
  log: DailyLog;
}

function splitDateParts(dateIso: string): { month: string; day: string; year: string } {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) {
    return { month: "—", day: "—", year: "—" };
  }
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = String(d.getFullYear());
  return { month, day, year };
}

function formatTotalHours(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const s = value.toFixed(2);
  return s.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function locationEvents(dutyEntries: DailyLog["dutyEntries"]): { time: number; label: string }[] {
  const out: { time: number; label: string }[] = [];
  let lastLabel = "";
  for (const e of dutyEntries) {
    const label = (e.location || "").trim();
    if (!label) continue;
    if (label === lastLabel) continue;
    lastLabel = label;
    out.push({ time: e.startTimeDecimal, label });
  }
  return out;
}

function timeToRulerX(x0: number, width: number, decimalHour: number): number {
  return x0 + (decimalHour / 24) * width;
}

function snapToQuarterHour(decimalHour: number): number {
  if (!Number.isFinite(decimalHour)) return 0;
  const snapped = Math.round(decimalHour * 4) / 4;
  return Math.max(0, Math.min(24, snapped));
}

function timeLabelPlacement(args: {
  x0: number;
  pxPerHour: number;
  hour: number;
}): { x: number; textAnchor: "start" | "middle" | "end"; fontSize: number } {
  const { x0, pxPerHour, hour } = args;

  if (hour === 0) {
    return { x: x0 + 2, textAnchor: "start", fontSize: 9.25 };
  }

  if (hour === 12) {
    // Keep Noon close to the tick like the printed form, but nudge right so it never collides with “11”.
    return { x: x0 + hour * pxPerHour + 6, textAnchor: "start", fontSize: 9.25 };
  }

  if (hour === 11) {
    // Nudge left so “11” stays visually separate from “Noon” on narrow renders.
    return {
      x: x0 + hour * pxPerHour + pxPerHour / 2 - 6,
      textAnchor: "middle",
      fontSize: 10,
    };
  }

  return { x: x0 + hour * pxPerHour + pxPerHour / 2, textAnchor: "middle", fontSize: 10 };
}

function spreadOverlappingLabels(
  events: { time: number; label: string }[],
  minDxHours: number,
): { time: number; label: string; lane: number }[] {
  const sorted = [...events].sort((a, b) => a.time - b.time);
  const lanesLastX: number[] = [];
  const out: { time: number; label: string; lane: number }[] = [];

  for (const ev of sorted) {
    const x = ev.time; // time used as monotonic proxy; caller maps to px
    let lane = 0;
    while (lane < lanesLastX.length) {
      const last = lanesLastX[lane];
      if (last === undefined) break;
      if (x - last >= minDxHours) break;
      lane += 1;
    }
    if (lane === lanesLastX.length) lanesLastX.push(x);
    else lanesLastX[lane] = x;
    out.push({ ...ev, lane });
  }
  return out;
}

export function Form4DailyLogSheet({ log }: Form4DailyLogSheetProps) {
  const W = FORM4.sheet.width;
  const H = FORM4.sheet.height;
  const P = FORM4.sheet.pad;

  const { month, day, year } = splitDateParts(log.date);

  const grid = FORM4.grid;
  const totals = FORM4.totals;
  const remarks = FORM4.remarks;

  const rowH = grid.height / grid.rows;
  const pxPerHour = grid.width / 24;
  const locEvents = locationEvents(log.dutyEntries);
  const totalsByRow = [
    formatTotalHours(log.totals.offDuty),
    formatTotalHours(log.totals.sleeperBerth),
    formatTotalHours(log.totals.driving),
    formatTotalHours(log.totals.onDuty),
  ];
  const totalAll = formatTotalHours(log.totals.total);

  return (
    <div className="form4-sheet w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="form4-svg w-full min-w-[980px]"
        role="img"
        aria-label="FMCSA Form 4 driver's daily log"
      >
        {/* Outer border */}
        <rect
          x={P}
          y={P}
          width={W - P * 2}
          height={H - P * 2}
          fill="none"
          stroke={FORM4_COLORS.ink}
          strokeWidth={1.25}
        />

        {/* Top headings (3 columns) */}
        <text
          x={P + 20}
          y={P + 34}
          fontSize={11}
          fill={FORM4_COLORS.ink}
          fontFamily="Arial, sans-serif"
        >
          U.S. DEPARTMENT OF TRANSPORTATION
        </text>

        <text
          x={W / 2}
          y={P + 38}
          fontSize={18}
          fontWeight={700}
          textAnchor="middle"
          fill={FORM4_COLORS.ink}
          fontFamily="Arial, sans-serif"
        >
          DRIVER&apos;S DAILY LOG
        </text>
        <text
          x={W / 2}
          y={P + 58}
          fontSize={10.5}
          fontWeight={600}
          textAnchor="middle"
          fill={FORM4_COLORS.ink}
          fontFamily="Arial, sans-serif"
        >
          (ONE CALENDAR DAY — 24 HOURS)
        </text>

        <text
          x={W - P - 20}
          y={P + 34}
          fontSize={10.5}
          textAnchor="end"
          fill={FORM4_COLORS.ink}
          fontFamily="Arial, sans-serif"
        >
          ORIGINAL — Submit to carrier within 13 days
        </text>
        <text
          x={W - P - 20}
          y={P + 50}
          fontSize={10.5}
          textAnchor="end"
          fill={FORM4_COLORS.ink}
          fontFamily="Arial, sans-serif"
        >
          DUPLICATE — Driver retains possession for eight days
        </text>

        {/* Date block (month/day/year) */}
        <g transform={`translate(${P + 18}, ${P + 62})`}>
          <text fontSize={10} fontWeight={700} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            DATE
          </text>
          <rect x={0} y={14} width={180} height={50} fill="none" stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <line x1={60} y1={14} x2={60} y2={64} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <line x1={120} y1={14} x2={120} y2={64} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <text
            x={30}
            y={40}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={22}
            fontWeight={700}
            fill={FORM4_COLORS.ink}
            fontFamily="Arial, sans-serif"
          >
            {month}
          </text>
          <text
            x={90}
            y={40}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={22}
            fontWeight={700}
            fill={FORM4_COLORS.ink}
            fontFamily="Arial, sans-serif"
          >
            {day}
          </text>
          <text
            x={150}
            y={40}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={22}
            fontWeight={700}
            fill={FORM4_COLORS.ink}
            fontFamily="Arial, sans-serif"
          >
            {year}
          </text>
          <text x={30} y={78} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (MONTH)
          </text>
          <text x={90} y={78} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (DAY)
          </text>
          <text x={150} y={78} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (YEAR)
          </text>
        </g>

        {/* Total miles driving today (center) */}
        <g transform={`translate(${W / 2 - 110}, ${P + 66})`}>
          <text
            x={110}
            y={22}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={28}
            fontWeight={800}
            fill={FORM4_COLORS.ink}
            fontFamily="Arial, sans-serif"
          >
            {Math.round(log.totalMiles)}
          </text>
          <text
            x={110}
            y={38}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9.5}
            fill={FORM4_COLORS.ink}
            fontFamily="Arial, sans-serif"
          >
            (TOTAL MILES DRIVING TODAY)
          </text>
        </g>

        {/* Vehicle numbers (right) */}
        <g transform={`translate(${W - P - 330}, ${P + 78})`}>
          <text x={330} y={0} textAnchor="end" fontSize={11} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            VEHICLE NUMBERS—(SHOW EACH UNIT)
          </text>
          <line x1={120} y1={14} x2={330} y2={14} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <text x={330} y={30} textAnchor="end" fontSize={14} fontWeight={700} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            {log.truckNumber || "—"} {log.trailerNumber ? `, ${log.trailerNumber}` : ""}
          </text>
        </g>

        {/* Carrier / Driver signature lines */}
        <g transform={`translate(${P + 210}, ${P + 132})`}>
          <line x1={0} y1={0} x2={380} y2={0} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <text x={190} y={-10} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (NAME OF CARRIER OR CARRIERS)
          </text>
          <text x={190} y={28} textAnchor="middle" fontSize={28} fontStyle="italic" fontFamily="Georgia, serif" fill={FORM4_COLORS.ink}>
            {log.carrierName || "—"}
          </text>

          <line x1={0} y1={58} x2={380} y2={58} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <text x={190} y={48} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (MAIN OFFICE ADDRESS)
          </text>
          <text x={190} y={88} textAnchor="middle" fontSize={26} fontStyle="italic" fontFamily="Georgia, serif" fill={FORM4_COLORS.ink}>
            {log.officeAddress || "—"}
          </text>
        </g>

        <g transform={`translate(${W - P - 560}, ${P + 132})`}>
          <text x={0} y={-10} fontSize={10} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            I certify that these entries are true and correct
          </text>
          <line x1={0} y1={0} x2={540} y2={0} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <text x={410} y={28} textAnchor="middle" fontSize={28} fontStyle="italic" fontFamily="Georgia, serif" fill={FORM4_COLORS.ink}>
            {log.driverName || "—"}
          </text>
          <text x={410} y={46} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (DRIVER&apos;S SIGNATURE IN FULL)
          </text>

          <line x1={280} y1={58} x2={540} y2={58} stroke={FORM4_COLORS.rule} strokeWidth={1} />
          <text x={410} y={88} textAnchor="middle" fontSize={18} fontStyle="italic" fontFamily="Georgia, serif" fill={FORM4_COLORS.ink}>
            {log.coDriver || "—"}
          </text>
          <text x={410} y={104} textAnchor="middle" fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
            (NAME OF CO_DRIVER)
          </text>
        </g>

        {/* Main grid frame */}
        <g>
          {/* Row labels */}
          {[
            { label: "Off\nDuty", idx: 0 },
            { label: "Sleeper\nBerth", idx: 1 },
            { label: "Driving", idx: 2 },
            { label: "On Duty\n(Not\nDriving)", idx: 3 },
          ].map((r) => (
            <text
              key={r.idx}
              x={P + 60}
              y={grid.y0 + r.idx * rowH + rowH / 2 - 8}
              fontSize={12}
              fontWeight={700}
              fill={FORM4_COLORS.ink}
              fontFamily="Arial, sans-serif"
            >
              {r.label.split("\n").map((t, i) => (
                <tspan key={i} x={P + 60} dy={i === 0 ? 0 : 14}>
                  {t}
                </tspan>
              ))}
            </text>
          ))}

          {/* Grid rectangle */}
          <rect
            x={grid.x0}
            y={grid.y0}
            width={grid.width}
            height={grid.height}
            fill="none"
            stroke={FORM4_COLORS.ink}
            strokeWidth={FORM4_STROKES.gridBorder}
          />

          {/* Horizontal row separators */}
          {Array.from({ length: grid.rows - 1 }, (_, i) => (
            <line
              key={`row-${i}`}
              x1={grid.x0}
              y1={grid.y0 + (i + 1) * rowH}
              x2={grid.x0 + grid.width}
              y2={grid.y0 + (i + 1) * rowH}
              stroke={FORM4_COLORS.rule}
              strokeWidth={1}
            />
          ))}

          {/* Quarter-hour lines (light) */}
          {Array.from({ length: 24 }, (_, h) =>
            [0.25, 0.5, 0.75].map((q) => (
              <line
                key={`q-${h}-${q}`}
                x1={grid.x0 + (h + q) * pxPerHour}
                y1={grid.y0}
                x2={grid.x0 + (h + q) * pxPerHour}
                y2={grid.y0 + grid.height}
                stroke={FORM4_COLORS.faintRule}
                strokeWidth={FORM4_STROKES.minorQuarter}
              />
            )),
          )}

          {/* Hour lines (darker) with emphasized 00:00 + 12:00 + 24:00 */}
          {Array.from({ length: 25 }, (_, h) => {
            const isNoonOrMidnight = h === 0 || h === 12 || h === 24;
            return (
              <line
                key={`h-${h}`}
                x1={grid.x0 + h * pxPerHour}
                y1={grid.y0}
                x2={grid.x0 + h * pxPerHour}
                y2={grid.y0 + grid.height}
                stroke={FORM4_COLORS.lightRule}
                strokeWidth={isNoonOrMidnight ? FORM4_STROKES.noonMidnight : FORM4_STROKES.majorHour}
              />
            );
          })}

          {/* Top/bottom border tick marks (Form 4 feel) */}
          {Array.from({ length: 25 }, (_, h) => {
            const x = grid.x0 + h * pxPerHour;
            const isNoonOrMidnight = h === 0 || h === 12 || h === 24;
            const sw = isNoonOrMidnight ? FORM4_STROKES.noonMidnight : FORM4_STROKES.axisTickMajor;
            const stroke = isNoonOrMidnight ? FORM4_COLORS.rule : FORM4_COLORS.lightRule;
            return (
              <g key={`tick-h-${h}`}>
                <line x1={x} y1={grid.y0} x2={x} y2={grid.y0 + 8} stroke={stroke} strokeWidth={sw} />
                <line
                  x1={x}
                  y1={grid.y0 + grid.height}
                  x2={x}
                  y2={grid.y0 + grid.height - 8}
                  stroke={stroke}
                  strokeWidth={sw}
                />
              </g>
            );
          })}
          {Array.from({ length: 24 }, (_, h) =>
            [0.25, 0.5, 0.75].map((q) => {
              const x = grid.x0 + (h + q) * pxPerHour;
              return (
                <g key={`tick-q-${h}-${q}`}>
                  <line
                    x1={x}
                    y1={grid.y0}
                    x2={x}
                    y2={grid.y0 + 5}
                    stroke={FORM4_COLORS.faintRule}
                    strokeWidth={FORM4_STROKES.axisTickMinor}
                  />
                  <line
                    x1={x}
                    y1={grid.y0 + grid.height}
                    x2={x}
                    y2={grid.y0 + grid.height - 5}
                    stroke={FORM4_COLORS.faintRule}
                    strokeWidth={FORM4_STROKES.axisTickMinor}
                  />
                </g>
              );
            }),
          )}

          {/* Time labels (top only) */}
          {Array.from({ length: 24 }, (_, i) => {
            const label = i === 0 ? "Midnight" : i === 12 ? "Noon" : String(i);
            const top = timeLabelPlacement({ x0: grid.x0, pxPerHour, hour: i });
            return (
              <g key={`t-${i}`}>
                <text
                  x={top.x}
                  y={grid.y0 - 10}
                  fontSize={top.fontSize}
                  textAnchor={top.textAnchor}
                  fill={FORM4_COLORS.ink}
                  fontFamily="Arial, sans-serif"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Duty path overlay (rendered later) */}
          <Form4DutyPath dutyEntries={log.dutyEntries} grid={grid} />
        </g>

        {/* Totals column frame */}
        <g>
          <rect
            x={totals.x0}
            y={totals.y0}
            width={totals.width}
            height={totals.height}
            fill="none"
            stroke={FORM4_COLORS.ink}
            strokeWidth={1.25}
          />
          <text
            x={totals.x0 + totals.width / 2}
            y={totals.y0 - 10}
            fontSize={11}
            fontWeight={700}
            textAnchor="middle"
            fill={FORM4_COLORS.ink}
            fontFamily="Arial, sans-serif"
          >
            TOTAL HOURS
          </text>
          {Array.from({ length: 3 }, (_, i) => (
            <line
              key={`tot-row-${i}`}
              x1={totals.x0}
              y1={totals.y0 + (i + 1) * rowH}
              x2={totals.x0 + totals.width}
              y2={totals.y0 + (i + 1) * rowH}
              stroke={FORM4_COLORS.rule}
              strokeWidth={1}
            />
          ))}

          {totalsByRow.map((v, i) => (
            <text
              key={`tot-${i}`}
              x={totals.x0 + totals.width - 10}
              y={totals.y0 + i * rowH + rowH / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={30}
              fontStyle="italic"
              fontWeight={700}
              fill={FORM4_COLORS.ink}
              fontFamily="Georgia, serif"
            >
              {v}
            </text>
          ))}
          <text
            x={totals.x0 + totals.width - 10}
            y={totals.y0 + totals.height + 30}
            textAnchor="end"
            fontSize={34}
            fontStyle="italic"
            fontWeight={800}
            fill={FORM4_COLORS.ink}
            fontFamily="Georgia, serif"
          >
            {/* Intentionally blank: =24 is rendered on the REMARKS ruler row */}
          </text>
        </g>

        {/* REMARKS ruler row + remarks body */}
        <g>
          {(() => {
            const rulerH = FORM4_REMARKS.rulerHeight;
            const ruler = {
              x0: grid.x0,
              y0: remarks.y0,
              width: grid.width,
              height: rulerH,
            };
            const px = ruler.width / 24;
            const topY = ruler.y0;
            const botY = ruler.y0 + ruler.height;
            const majorLen = FORM4_REMARKS.rulerTickMajor;
            const minorLen = FORM4_REMARKS.rulerTickMinor;
            const underY = botY + 26;
            const shipValueX = P + 120;
            const shipLineStart = shipValueX - 4;
            const minShipLine = 96;
            const maxShipLine = 210;
            const preferredShipLine = Math.round(ruler.width * 0.18);
            const shipLineLen = Math.max(
              minShipLine,
              Math.min(maxShipLine, preferredShipLine),
            );
            const shipLineEnd = shipLineStart + shipLineLen;
            const displayedLocEvents = spreadOverlappingLabels(
              locEvents.filter((ev) => ev.time >= 1.0),
              1.25,
            ).slice(0, 14);

            return (
              <>
                <text
                  x={P + 50}
                  y={ruler.y0 + 24}
                  fontSize={11}
                  fontWeight={700}
                  fill={FORM4_COLORS.ink}
                  fontFamily="Arial, sans-serif"
                >
                  REMARKS
                </text>

                {/* ruler frame (top line only like form) */}
                <line
                  x1={ruler.x0}
                  y1={topY}
                  x2={ruler.x0 + ruler.width}
                  y2={topY}
                  stroke={FORM4_COLORS.ink}
                  strokeWidth={FORM4_STROKES.gridBorder}
                />
                {/* Upper ruler only (no bottom rule line) */}

                {/* hour ticks */}
                {Array.from({ length: 25 }, (_, h) => {
                  const x = ruler.x0 + h * px;
                  const isNoonOrMidnight = h === 0 || h === 12 || h === 24;
                  const sw = isNoonOrMidnight ? FORM4_STROKES.noonMidnight : FORM4_STROKES.axisTickMajor;
                  const stroke = isNoonOrMidnight ? FORM4_COLORS.rule : FORM4_COLORS.lightRule;
                  return (
                    <g key={`rm-hour-${h}`}>
                      <line x1={x} y1={topY} x2={x} y2={topY + majorLen} stroke={stroke} strokeWidth={sw} />
                    </g>
                  );
                })}

                {/* quarter ticks */}
                {Array.from({ length: 24 }, (_, h) =>
                  [0.25, 0.5, 0.75].map((q) => {
                    const x = ruler.x0 + (h + q) * px;
                    return (
                      <g key={`rm-q-${h}-${q}`}>
                        <line
                          x1={x}
                          y1={topY}
                          x2={x}
                          y2={topY + minorLen}
                          stroke={FORM4_COLORS.faintRule}
                          strokeWidth={FORM4_STROKES.axisTickMinor}
                        />
                      </g>
                    );
                  }),
                )}

                {/* ruler labels (top) */}
                {Array.from({ length: 24 }, (_, i) => {
                  const label = i === 0 ? "Midnight" : i === 12 ? "Noon" : String(i);
                  const place = timeLabelPlacement({ x0: ruler.x0, pxPerHour: px, hour: i });
                  return (
                    <text
                      key={`rm-lbl-${i}`}
                      x={place.x}
                      y={ruler.y0 - 6}
                      fontSize={place.fontSize}
                      textAnchor={place.textAnchor}
                      fill={FORM4_COLORS.ink}
                      fontFamily="Arial, sans-serif"
                    >
                      {label}
                    </text>
                  );
                })}

                {/* =24 at far right of ruler */}
                <text
                  x={ruler.x0 + ruler.width + 6}
                  y={ruler.y0 + ruler.height - 8}
                  fontSize={28}
                  fontStyle="italic"
                  fontWeight={800}
                  fill={FORM4_COLORS.ink}
                  fontFamily="Georgia, serif"
                >
                  = {totalAll}
                </text>

                {/* shipping under left */}
                <text
                  x={P + 20}
                  y={underY + 18}
                  fontSize={9}
                  fill={FORM4_COLORS.ink}
                  fontFamily="Arial, sans-serif"
                >
                  Pro or Shipping No.
                </text>
                <text
                  x={shipValueX}
                  y={underY + 22}
                  fontSize={20}
                  fontWeight={800}
                  fontStyle="italic"
                  fill={FORM4_COLORS.ink}
                  fontFamily="Georgia, serif"
                >
                  {log.shippingDoc || "—"}
                </text>
                <line
                  x1={shipLineStart}
                  y1={underY + 26}
                  x2={shipLineEnd}
                  y2={underY + 26}
                  stroke={FORM4_COLORS.ink}
                  strokeWidth={1}
                />

                {/* diagonal locations based on event times */}
                {displayedLocEvents.map((ev, i) => {
                    const snappedTime = snapToQuarterHour(ev.time);
                    const x = timeToRulerX(ruler.x0, ruler.width, snappedTime);
                    const baseY = underY - 2;
                    const y = baseY + ev.lane * 16;
                    const label = ev.label.length > 22 ? `${ev.label.slice(0, 22)}…` : ev.label;
                    if (x < ruler.x0 + 46) return null;
                    return (
                      <g key={`${ev.label}-${i}`}>
                        {/* remark marker: U open at top (∪) */}
                        {(() => {
                          const yBottom = underY - 10;
                          const legDx = 8;
                          return (
                            <>
                              <line
                                x1={x - legDx}
                                y1={topY}
                                x2={x - legDx}
                                y2={yBottom}
                                stroke={FORM4_COLORS.dutyBlue}
                                strokeWidth={2}
                                strokeLinecap="square"
                              />
                              <line
                                x1={x + legDx}
                                y1={topY}
                                x2={x + legDx}
                                y2={yBottom}
                                stroke={FORM4_COLORS.dutyBlue}
                                strokeWidth={2}
                                strokeLinecap="square"
                              />
                              <line
                                x1={x - legDx}
                                y1={yBottom}
                                x2={x + legDx}
                                y2={yBottom}
                                stroke={FORM4_COLORS.dutyBlue}
                                strokeWidth={2}
                                strokeLinecap="square"
                              />
                            </>
                          );
                        })()}

                        <text
                          x={x}
                          y={y}
                          fontSize={12}
                          fontStyle="italic"
                          fill={FORM4_COLORS.ink}
                          fontFamily="Georgia, serif"
                          textAnchor="start"
                          transform={`rotate(${FORM4_REMARKS.locationAngleDeg} ${x} ${y})`}
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
              </>
            );
          })()}
        </g>

        {/* Footer date (tiny) */}
        <text x={P + 20} y={H - P - 12} fontSize={9} fill={FORM4_COLORS.ink} fontFamily="Arial, sans-serif">
          ({formatDateString(log.date)})
        </text>
      </svg>
    </div>
  );
}

