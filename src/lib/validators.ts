export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidCycleHours(hours: number): boolean {
  return hours >= 0 && hours <= 70;
}

export function isValidTruckNumber(value: string): boolean {
  return value.trim().length > 0 && value.trim().length <= 20;
}
