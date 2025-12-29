import { dateFormatTemplate } from '../lib';

export class DateTime {
  private _dateFormat?: string;

  private _dateTimeFormat?: string;

  constructor(public readonly value: Date) {}

  public get dateFormat(): string {
    if (!this._dateFormat) {
      this._dateFormat = dateFormatTemplate(this.value, '{dd}/{mx}/{yy}');
    }

    return this._dateFormat;
  }

  public get dateTimeFormat(): string {
    if (!this._dateTimeFormat) {
      this._dateTimeFormat = dateFormatTemplate(
        this.value,
        '{dd}/{mx}/{yy} {hh}:{ii} {zz}'
      );
    }

    return this._dateTimeFormat;
  }
}
