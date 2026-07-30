// Determines NYSE trading days: weekdays excluding the exchange's
// observed holidays (fixed-date holidays shift off weekends, floating
// holidays are already weekday rules; Good Friday is computed from Easter).

function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month, 1);
  const offset = (7 + weekday - first.getDay()) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const diff = (7 + lastDayOfMonth.getDay() - weekday) % 7;
  const result = new Date(lastDayOfMonth);
  result.setDate(result.getDate() - diff);
  return result;
}

// Fixed-date holidays are observed the nearest weekday: Saturday moves to
// the preceding Friday, Sunday moves to the following Monday.
function observedFixedHoliday(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  if (dow === 6) date.setDate(date.getDate() - 1);
  else if (dow === 0) date.setDate(date.getDate() + 1);
  return date;
}

// Anonymous Gregorian algorithm for the date of Easter Sunday.
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monthDay = h + l - 7 * m + 114;
  const month = Math.floor(monthDay / 31);
  const day = (monthDay % 31) + 1;
  return new Date(year, month - 1, day);
}

function goodFriday(year: number): Date {
  const gf = easterSunday(year);
  gf.setDate(gf.getDate() - 2);
  return gf;
}

function toIsoDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function nyseHolidays(year: number): Set<string> {
  const holidays: Date[] = [
    observedFixedHoliday(year, 0, 1),     // New Year's Day
    nthWeekdayOfMonth(year, 0, 1, 3),     // Martin Luther King Jr. Day
    nthWeekdayOfMonth(year, 1, 1, 3),     // Washington's Birthday
    goodFriday(year),
    lastWeekdayOfMonth(year, 4, 1),       // Memorial Day
    observedFixedHoliday(year, 6, 4),     // Independence Day
    nthWeekdayOfMonth(year, 8, 1, 1),     // Labor Day
    nthWeekdayOfMonth(year, 10, 4, 4),    // Thanksgiving Day
    observedFixedHoliday(year, 11, 25),   // Christmas Day
  ];

  if (year >= 2022) {
    holidays.push(observedFixedHoliday(year, 5, 19)); // Juneteenth National Independence Day
  }

  return new Set(holidays.map(toIsoDateString));
}

export function isNyseTradingDay(date: Date): boolean {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return false;
  return !nyseHolidays(date.getFullYear()).has(toIsoDateString(date));
}

// Most recent NYSE trading day strictly before the given date.
export function previousNyseTradingDate(date: Date): Date {
  const cursor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  do {
    cursor.setDate(cursor.getDate() - 1);
  } while (!isNyseTradingDay(cursor));
  return cursor;
}

export { toIsoDateString };
