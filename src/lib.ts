import { DAY_NAMES, MONTH_DAYS, MONTH_LABELS, MONTH_NAMES } from './constants';
import { Miliseconds } from './types';

type DateFormat = Record<string, (date: Date) => string>;

function formatComplet(value: number, size: number): string {
  return value.toString().padStart(size, '0');
}

function formatHour(date: Date): number {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
}

function verifyDayInYear(date: Date, year: number): void {
  const days = daysFromMonth(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Establecer el año
}

function verifyDayInMonth(date: Date, month: number): void {
  const days = daysFromMonth(date.getFullYear(), month);

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setMonth(month); // Establecer el mes
}

const FORMATTERS: DateFormat = {
  dd: (date: Date): string => {
    return formatComplet(date.getDate(), 2);
  },
  dw: (date: Date): string => {
    return DAY_NAMES()[date.getDay()];
  },
  dx: (date: Date): string => {
    return DAY_NAMES()[date.getDay()];
  },
  mm: (date: Date): string => {
    return formatComplet(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MONTH_NAMES(date.getMonth());
  },
  mx: (date: Date): string => {
    return MONTH_LABELS(date.getMonth());
  },
  aa: (date: Date): string => {
    return formatComplet(date.getFullYear(), 4);
  },
  hh: (date: Date): string => {
    return formatComplet(date.getHours(), 2);
  },
  ii: (date: Date): string => {
    return formatComplet(date.getMinutes(), 2);
  },
  ss: (date: Date): string => {
    return formatComplet(date.getSeconds(), 2);
  },
  hz: (date: Date): string => {
    return formatComplet(formatHour(date), 2);
  },
  zz: (date: Date): string => {
    return date.getHours() > 11 ? 'PM' : 'AM';
  },
  ddThh: (date: Date): string => {
    const day = formatComplet(date.getDate(), 2);
    const hour = formatComplet(date.getHours(), 2);

    return `${day}T${hour}`;
  }
};

interface ElapsedTime {
  value: number;
  label: string;
  single: string;
  plural: string;
}

interface PendingTime {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const createElapsedTime = (
  value: Miliseconds,
  single: string,
  charPlural = 's',
  plural?: string
): ElapsedTime => {
  plural = plural || `${single}${charPlural}`;

  const label = `${single}(${charPlural})`;

  return {
    value,
    label,
    single,
    plural
  };
};

const ELAPSED_TIMES: ElapsedTime[] = [
  createElapsedTime(Miliseconds.Year, 'año'),
  createElapsedTime(Miliseconds.Month, 'mes', 'es'),
  createElapsedTime(Miliseconds.Week, 'semana'),
  createElapsedTime(Miliseconds.Day, 'día', 's', 'dias'),
  createElapsedTime(Miliseconds.Hour, 'hora'),
  createElapsedTime(Miliseconds.Minute, 'minuto'),
  createElapsedTime(Miliseconds.Second, 'segundo')
];

export function formatForHumans(milliseconds: number): string {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < ELAPSED_TIMES.length) {
    const elapsed = ELAPSED_TIMES[index];
    const result = Math.floor(value / elapsed.value);

    if (result >= 1) {
      const label = result === 1 ? elapsed.single : elapsed.plural;

      description = `${prefix} ${result} ${label}`;
    }

    index++;
  }

  return description;
}

export function pendingTime(initial: Date, future = new Date()): PendingTime {
  const difference = future.getTime() - initial.getTime();

  return {
    years: Math.floor(difference / Miliseconds.Year),
    months: Math.floor(difference / Miliseconds.Month),
    weeks: Math.floor(difference / Miliseconds.Week),
    days: Math.floor(difference / Miliseconds.Day),
    hours: Math.floor(difference / Miliseconds.Hour),
    minutes: Math.floor(difference / Miliseconds.Minute),
    seconds: Math.floor(difference / Miliseconds.Second)
  };
}

export function upWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}

export function upWithDays(date: Date, days = 1): Date {
  return upWithTimestamp(date, days * Miliseconds.Day);
}

export function upWithWeeks(date: Date, week = 1): Date {
  return upWithTimestamp(date, week * Miliseconds.Week);
}

export function downWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() - timestamp);
}

export function downWithDays(date: Date, days = 1): Date {
  return downWithTimestamp(date, days * Miliseconds.Day);
}

export function downWithWeeks(date: Date, week = 1): Date {
  return downWithTimestamp(date, week * Miliseconds.Week);
}

export function equals(date: Date, compare = new Date()): boolean {
  return date.getTime() === compare.getTime();
}

export function equalsWeight(date: Date, compare = new Date()): boolean {
  return weight(date) === weight(compare);
}

export function before(date: Date, compare = new Date()): boolean {
  return date.getTime() > compare.getTime();
}

export function beforeOrEquals(date: Date, compare = new Date()): boolean {
  return date.getTime() >= compare.getTime();
}

export function after(date: Date, compare = new Date()): boolean {
  return date.getTime() < compare.getTime();
}

export function afterOrEquals(date: Date, compare = new Date()): boolean {
  return date.getTime() <= compare.getTime();
}

export function between(
  minDate: Date,
  maxDate: Date,
  compare = new Date()
): boolean {
  return after(minDate, compare) && before(maxDate, compare);
}

export function betweenOrEquals(
  minDate: Date,
  maxDate: Date,
  compare = new Date()
): boolean {
  return afterOrEquals(minDate, compare) || beforeOrEquals(maxDate, compare);
}

export function timeDifference(date: Date, compare = new Date()): number {
  return date.getTime() - compare.getTime();
}

export function differenceForHumans(date: Date, compare = new Date()): string {
  return formatForHumans(timeDifference(date, compare));
}

export function normalizeMinTime(date: Date): Date {
  const normalize = new Date(date.getTime());

  normalize.setHours(0);
  normalize.setMinutes(0);
  normalize.setSeconds(0);
  normalize.setMilliseconds(0);

  return normalize;
}

export function normalizeMaxTime(date: Date): Date {
  const normalize = new Date(date.getTime());

  normalize.setHours(23);
  normalize.setMinutes(59);
  normalize.setSeconds(59);
  normalize.setMilliseconds(0);

  return normalize;
}

export function weight(date: Date): number {
  return date.getFullYear() * 365 + (date.getMonth() + 1) * 30 + date.getDate();
}

export function daysFromMonth(year: number, month: number): number {
  return month === 1 && isLeapYear(year) ? 29 : MONTH_DAYS[month];
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

const regInterpolation = /([^( |,|.|:|;|\+|\-|\/|_|@|#|$|%|&)][a-zA-Z]*)/g;

export function formatDate(date: Date, template: string): string {
  return template.replace(regInterpolation, (key) =>
    FORMATTERS[key] ? FORMATTERS[key](date) : key
  );
}

interface CreateDate {
  day?: number;
  month?: number;
  year?: number;
}

export function createDate({ day, month, year }: CreateDate): Date {
  const newDate = new Date();

  if (year) {
    verifyDayInYear(newDate, year);
  }

  if (month) {
    verifyDayInMonth(newDate, month);
  }

  if (day) {
    newDate.setDate(day);
  }

  return newDate;
}

export function assignYear(date: Date, year: number): Date {
  const newDate = new Date(date.getTime());

  verifyDayInYear(newDate, year);

  newDate.setFullYear(year);

  return newDate;
}

export function assignMonth(date: Date, month: number): Date {
  const newDate = new Date(date.getTime());

  verifyDayInMonth(newDate, month);

  newDate.setMonth(month);

  return newDate;
}

export function assignDay(date: Date, day: number): Date {
  const newDate = new Date(date.getTime());

  newDate.setDate(day);

  return newDate;
}
