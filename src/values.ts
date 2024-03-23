import {
  after,
  before,
  between,
  normalizeMinTime,
  timeDifference
} from './lib';

export class DateRange {
  public readonly minDate: Date;

  public readonly maxDate: Date;

  constructor(minDate: Date, maxDate?: Date) {
    this.minDate = normalizeMinTime(minDate);

    this.maxDate =
      maxDate && before(maxDate, minDate)
        ? normalizeMinTime(maxDate)
        : normalizeMinTime(minDate);
  }

  public get minISOFormat(): string {
    return this.minDate.toISOString();
  }

  public get maxISOFormat(): string {
    return this.maxDate.toISOString();
  }

  public between(date: Date): boolean {
    return between(this.minDate, this.maxDate, date);
  }

  public recalculate(date: Date): DateRange {
    if (before(this.minDate, date)) {
      return new DateRange(date, this.maxDate);
    }

    if (after(this.maxDate, date)) {
      return new DateRange(this.minDate, date);
    }

    const minDifference = timeDifference(date, this.minDate);
    const maxDifference = timeDifference(this.maxDate, date);

    return minDifference > maxDifference
      ? new DateRange(this.minDate, date)
      : new DateRange(date, this.maxDate);
  }

  public static now(): DateRange {
    return new DateRange(new Date());
  }
}
