import { Marker, Popup } from "react-leaflet";
import type { DivIcon, LatLngTuple } from "leaflet";
import L from "leaflet";

import { BADGE_BASE } from "@/lib/styles";
import { DUTY_STATUS_LABELS, STOP_TYPE_LABELS } from "@/constants/dutyStatus";
import { formatHoursMinutes, formatTimeString } from "@/lib/formatTime";
import type { TripStop } from "@/types/trip";
import { StopType } from "@/types/trip";

interface StopMarkerProps {
  stop: TripStop;
  isSelected: boolean;
  onClick: () => void;
}

interface StopIconConfig {
  emoji: string;
  color: string;
}

const STOP_ICON_CONFIG: Record<StopType, StopIconConfig> = {
  [StopType.START]: { emoji: "\u{1F7E2}", color: "#16a34a" },
  [StopType.FUEL]: { emoji: "\u26FD", color: "#d97706" },
  [StopType.REST_BREAK]: { emoji: "\u2615", color: "#7c3aed" },
  [StopType.MANDATORY_REST]: { emoji: "\u{1F6CF}\uFE0F", color: "#2563eb" },
  [StopType.PICKUP]: { emoji: "\u{1F4E6}", color: "#0891b2" },
  [StopType.DROPOFF]: { emoji: "\u{1F534}", color: "#dc2626" },
  [StopType.END]: { emoji: "\u{1F3C1}", color: "#6b7280" },
  [StopType.CYCLE_RESET]: { emoji: "\u{1F504}", color: "#4f46e5" },
};

function createStopIcon(type: StopType): DivIcon {
  const config = STOP_ICON_CONFIG[type];
  return L.divIcon({
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:${config.color};transform:rotate(-45deg);
      box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;
    "><span style="transform:rotate(45deg);font-size:16px;line-height:1">${config.emoji}</span></div>`,
  });
}

const iconCache = new Map<StopType, DivIcon>();

function getStopIcon(type: StopType): DivIcon {
  const cached = iconCache.get(type);
  if (cached) {
    return cached;
  }
  const icon = createStopIcon(type);
  iconCache.set(type, icon);
  return icon;
}

export function StopMarker({ stop, isSelected, onClick }: StopMarkerProps) {
  const position: LatLngTuple = [stop.latitude, stop.longitude];

  const icon = getStopIcon(stop.type);

  return (
    <Marker position={position} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <div className="min-w-[200px] max-w-[250px]">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <span>{STOP_TYPE_LABELS[stop.type]}</span>
            <span className={`${BADGE_BASE} bg-slate-100 text-slate-700`}>
              {formatHoursMinutes(stop.durationHours)}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-600">{stop.locationName}</div>
          <div className="my-2 border-t border-slate-100" />
          <dl className="space-y-1 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <dt className="font-medium">Arrival</dt>
              <dd className="font-mono">
                {stop.arrivalTime ? formatTimeString(stop.arrivalTime) : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Duration</dt>
              <dd className="font-mono">{formatHoursMinutes(stop.durationHours)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Status</dt>
              <dd>{DUTY_STATUS_LABELS[stop.dutyStatus]}</dd>
            </div>
          </dl>
          {stop.remarks && (
            <p className="mt-2 text-[11px] text-slate-500">“{stop.remarks}”</p>
          )}
          {isSelected && (
            <p className="mt-1 text-[11px] font-medium text-blue-600">
              Selected from sidebar
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

