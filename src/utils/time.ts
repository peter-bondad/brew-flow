export function utcNow(): Date {
  return new Date();
}

export function utcHoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function utcMinutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function isExpired(date: Date): boolean {
  return date.getTime() <= Date.now();
}
