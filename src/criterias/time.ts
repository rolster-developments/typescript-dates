import { Criteria, CriteriaCallback } from '@rolster/commons';
import { Time } from '../values/time';

export class TimeCriteria extends Criteria<Time> {
  public equals(value: Time): boolean {
    return this.value.equals(value);
  }
}

export class TimeStandardISOCriteria extends TimeCriteria {
  public assign(callback: CriteriaCallback): void {
    callback(this.key, this.value.standardISOFormat);
  }
}

export class TimeNormalizeISOCriteria extends TimeCriteria {
  public assign(callback: CriteriaCallback): void {
    callback(this.key, this.value.normalizeISOFormat);
  }
}
