import { Criteria } from '@rolster/commons';
import { DateRange } from './values';

type KeyCriteria = string | number | symbol;

class DateRangeCriteria extends Criteria<DateRange> {
  constructor(
    public readonly minKey: string,
    public readonly maxKey: string,
    value: DateRange
  ) {
    super(minKey, value);
  }

  public equals(value: DateRange): boolean {
    return this.value.equals(value);
  }
}

export class CriteriaDateRangeTime extends DateRangeCriteria {
  public assign(callback: (key: KeyCriteria, value: any) => void): void {
    callback(this.minKey, this.value.minDate.getTime());
    callback(this.maxKey, this.value.maxDate.getTime());
  }
}

export class CriteriaDateRangeISO extends DateRangeCriteria {
  public assign(callback: (key: KeyCriteria, value: any) => void): void {
    callback(this.minKey, this.value.minISOFormat);
    callback(this.maxKey, this.value.maxISOFormat);
  }
}
