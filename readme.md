# Rolster Date Utilities

Utility package for manipulating Date compatible with Typescript projects.

## Installation

```
npm i @rolster/dates
```

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Features

All `Date` helpers are immutable: they return a brand new `Date` instead of
mutating the one you pass in.

### Formatting

`dateFormatTemplate` renders a `Date` using a template with `{token}`
placeholders:

```typescript
import { dateFormatTemplate } from '@rolster/dates';

const date = new Date('2026-06-08T15:30:45');

dateFormatTemplate(date, '{dd}/{mm}/{yy}'); // '08/06/2026'
dateFormatTemplate(date, '{dd} {mn} {yy}'); // '08 Junio 2026' (es by default)
dateFormatTemplate(date, '{hh}:{ii}:{ss}'); // '15:30:45'
dateFormatTemplate(date, '{hz}:{ii} {zz}'); // '03:30 PM'
```

| Token | Meaning                 | Token | Meaning             |
| ----- | ----------------------- | ----- | ------------------- |
| `dd`  | day (2 digits)          | `yy`  | year (4 digits)     |
| `dw`  | day-of-week name        | `yx`  | year (2 digits)     |
| `dx`  | day-of-week name        | `hh`  | hour 24h (2 digits) |
| `mm`  | month number (2 digits) | `hz`  | hour 12h (2 digits) |
| `mn`  | month name              | `ii`  | minutes (2 digits)  |
| `mx`  | month label (short)     | `ss`  | seconds (2 digits)  |
| `zz`  | meridiem (`AM`/`PM`)    |       |                     |

`dx` is an alias of `dw`. Note that `zz` emits `AM`/`PM`, while the `Time`
value object formats emit `A.M.`/`P.M.`.

### Human readable elapsed time

`getTimeDifferenceForHumans(date, compare = new Date())` describes the
distance between two dates with the largest unit that fits, prefixed by
`Falta` (future) or `Hace` (past). `dateFormatForHumans(milliseconds)` is the
underlying formatter for a raw difference in milliseconds:

```typescript
import {
  dateFormatForHumans,
  getTimeDifferenceForHumans
} from '@rolster/dates';

const today = new Date('2026-06-08');

getTimeDifferenceForHumans(new Date('2026-06-10'), today); // 'Falta 2 dias'
getTimeDifferenceForHumans(new Date('2026-06-06'), today); // 'Hace 2 dias'
getTimeDifferenceForHumans(new Date('2026-06-08'), today); // 'Hace 1 segundo'

dateFormatForHumans(3600000); // 'Falta 1 hora'
```

These labels are hardcoded in Spanish and do not react to the `@rolster/i18n`
locale.

`calculateElapsed(start, end)` returns the calendar distance between two dates
as an `ElapsedDate` (`{ years, months, days }`). `calculateAge(birthDate)` is
the same calculation against the current date. Both return
`{ years: 0, months: 0, days: 0 }` when a date is missing or `start` is after
`end`:

```typescript
import { calculateAge, calculateElapsed } from '@rolster/dates';

calculateElapsed(
  new Date('1990-05-01T00:00:00'),
  new Date('2026-06-08T00:00:00')
); // { years: 36, months: 1, days: 7 }
calculateAge(new Date('1990-05-01')); // depends on the current date
```

`getPendingTime(initial, future = new Date())` expresses the whole difference
in every unit at once (each field is independent, not a breakdown):

```typescript
import { getPendingTime } from '@rolster/dates';

getPendingTime(new Date('2026-06-01'), new Date('2026-06-08'));
// { years: 0, months: 0, weeks: 1, days: 7, hours: 168, minutes: 10080, seconds: 604800 }
```

### Arithmetic

```typescript
import {
  increaseDaysInDate,
  decreaseDaysInDate,
  increaseWeeksInDate,
  decreaseWeeksInDate,
  increaseTimestampInDate,
  decreaseTimestampInDate,
  createDate,
  assignYearInDate,
  assignMonthInDate,
  assignDayInDate,
  Miliseconds
} from '@rolster/dates';

increaseDaysInDate(new Date('2026-06-08'), 5); // 2026-06-13
decreaseDaysInDate(new Date('2026-06-08'), 1); // 2026-06-07
increaseWeeksInDate(new Date('2026-06-08'), 2); // 2026-06-22
decreaseWeeksInDate(new Date('2026-06-08'), 1); // 2026-06-01

increaseTimestampInDate(new Date('2026-06-08'), Miliseconds.Hour); // + 1 hour
decreaseTimestampInDate(new Date('2026-06-08'), Miliseconds.Hour); // - 1 hour

createDate({ year: 2026, month: 5, day: 8 }); // safe builder (clamps invalid days)
assignYearInDate(new Date('2024-02-29T12:00:00'), 2025); // 2025-02-28 (day clamped)
assignMonthInDate(new Date(), 11); // same date, month set to December
assignDayInDate(new Date('2026-06-08'), 20); // 2026-06-20
```

The `days`/`week` arguments of the increase/decrease helpers default to `1`.
`assignYearInDate` and `assignMonthInDate` clamp the day to the last day of
the resulting month; `assignDayInDate` delegates to `Date.setDate` and
overflows into the next month.

### Comparisons

```typescript
import {
  dateIsEquals,
  dateIsEqualsWeight,
  dateIsBetween,
  getTimeDifference
} from '@rolster/dates';

const a = new Date('2026-06-08');
const b = new Date('2026-06-10');

dateIsEquals(a, a); // true (exact same timestamp)
dateIsEqualsWeight(a, b); // false (different calendar day, ignores time)

// is the third argument strictly inside (minDate, maxDate)?
dateIsBetween(a, new Date('2026-06-15'), b); // true

getTimeDifference(b, a); // 172800000 (b - a, in milliseconds)
```

`dateIsBetween(minDate, maxDate, compare = new Date())` checks the current
date when the third argument is omitted. The `compare` argument of every
comparison helper defaults to `new Date()`.

> Note: the directional helpers `dateIsBefore` / `dateIsAfter` (and their
> `...OrEquals` variants) take `(date, compare = new Date())`. They compare the
> two timestamps, so always double-check the argument order for your use case.

Other helpers: `normalizeMinTime`/`normalizeMaxTime` (set time to start/end of
day), `getDaysOfMonth`, `isLeapYear`, `getDateWeight`, `dateToJson` (returns a
`DateJson`), `cloneDate`.

### Value objects

**Time** — an immutable, comparable time of day with several string formats:

```typescript
import { Time } from '@rolster/dates';

const time = new Time(15, 30); // 15:30:00

time.hour; // 15
time.minute; // 30
time.second; // 0

time.standardISOFormat; // '15:30:00'
time.normalizeISOFormat; // '15:30'
time.meridiemFormat; // '03:30:00 P.M.'
time.normalizeMeridiemFormat; // '03:30 P.M.'

Time.now(); // current time (seconds normalized to 0)
Time.now(false); // current time, keeping seconds

time.equals(new Time(15, 30)); // true
time.lessThan(new Time(18, 0)); // true
time.greaterThan(new Time(9, 0)); // true
time.lessThanOrEqual(new Time(18, 0)); // true
time.greaterThanOrEqual(new Time(15, 30)); // true
```

**DateTime** — wraps a `Date` with cached, ready-to-use formats:

```typescript
import { DateTime } from '@rolster/dates';

const dt = new DateTime(new Date('2026-06-08T15:30:00'));

dt.value; // the wrapped Date
dt.dateFormat; // '08/Jun/2026' ({mx} = short month label, es by default)
dt.dateTimeFormat; // '08/Jun/2026 15:30 PM'
```

**DateRange** — a normalized `[minDate, maxDate]` interval. `minDate` is set
to the start of its day and `maxDate` to the end of its day. `maxDate` is
optional: when it is omitted, or when it is not later than `minDate`, the
range covers only the day of `minDate`:

```typescript
import { DateRange } from '@rolster/dates';

const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));

range.between(new Date('2026-06-15')); // true
range.minISOFormat; // '2026-06-01T...'
range.maxISOFormat; // '2026-06-30T...'
range.equals(new DateRange(new Date('2026-06-01'), new Date('2026-06-30'))); // true
range.recalculate(new Date('2026-07-10')); // grows the range to include the date

new DateRange(new Date('2026-06-08T12:00:00')); // single day: 2026-06-08 00:00:00 to 23:59:59
DateRange.now(); // today as a single-day range
```

`recalculate` returns a new range: when the date falls outside it, the range
grows to include it; when it falls inside, the nearest bound moves to it.

### Criterias

Criterias are the `@rolster/commons` building block for describing filters:
`Criteria<T>` holds a `key`/`value` pair and `assign(callback)` emits the
key/value entries that represent it. `Criterias` collects them and
`toLiteralObject()` turns them into a plain object. This package ships
criterias that serialize `DateRange` and `Time` values:

| Class                      | Emits                                                            |
| -------------------------- | ---------------------------------------------------------------- |
| `DateRangeCriteria`        | base class, `(key, minKey, maxKey, value: DateRange)`            |
| `DateRangeTimeCriteria`    | `minKey`/`maxKey` as timestamps                                  |
| `DateRangeISOCriteria`     | `minKey`/`maxKey` as ISO strings, both at the start of the day   |
| `DateTimeRangeISOCriteria` | `minKey`/`maxKey` as ISO strings, `maxKey` at the end of the day |
| `TimeCriteria`             | base class, `(key, value: Time)`                                 |
| `TimeStandardISOCriteria`  | `key` as `standardISOFormat` (`HH:mm:ss`)                        |
| `TimeNormalizeISOCriteria` | `key` as `normalizeISOFormat` (`HH:mm`)                          |

```typescript
import { Criterias } from '@rolster/commons';
import {
  DateRange,
  DateRangeISOCriteria,
  Time,
  TimeStandardISOCriteria
} from '@rolster/dates';

const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));

const criterias = new Criterias()
  .append(new DateRangeISOCriteria('period', 'dateFrom', 'dateTo', range))
  .append(new TimeStandardISOCriteria('time', new Time(15, 30)));

criterias.toLiteralObject();
// { dateFrom: '2026-06-01T...', dateTo: '2026-06-30T...', time: '15:30:00' }
```

`equals` of every criteria compares the wrapped value with `DateRange.equals`
/ `Time.equals`.

### Constants & enums

```typescript
import {
  Miliseconds,
  Day,
  Month,
  MonthDay,
  MONTH_DAYS,
  MONTH_NAMES,
  MONTH_LABELS,
  DAY_NAMES,
  DAY_LABELS
} from '@rolster/dates';

Miliseconds.Day; // 86400000
Month.December; // 11
Day.Monday; // 1
MonthDay.February; // 28
MONTH_DAYS; // [31, 28, 31, ...] (days per month, February always 28)

MONTH_NAMES(); // ['Enero', 'Febrero', ...] (es by default)
MONTH_NAMES(0); // 'Enero'
MONTH_LABELS(0); // 'Ene' (first 3 characters of the name)
DAY_NAMES(0); // 'Domingo'
DAY_LABELS(0); // 'Dom'
```

`MONTH_NAMES`, `MONTH_LABELS`, `DAY_NAMES` and `DAY_LABELS` return the whole
array when called without arguments and a single entry (or an empty string
when out of range) when called with an index. Use `getDaysOfMonth(year, month)`
instead of `MONTH_DAYS` when leap years matter.

Month/day names are localized through `@rolster/i18n` (default locale `es`,
also ships `en`). Calling `i18nLanguage` from `@rolster/i18n` updates
`MONTH_NAMES`, `MONTH_LABELS`, `DAY_NAMES`, `DAY_LABELS` and the `dw`, `dx`,
`mn`, `mx` template tokens reactively. The dictionary is exported as
`dateI18n`, an `@rolster/i18n` translate function:

```typescript
import { i18nLanguage } from '@rolster/i18n';
import { dateI18n, MONTH_NAMES } from '@rolster/dates';

dateI18n('january'); // 'Enero'
dateI18n('january', { language: 'en' }); // 'January'

i18nLanguage('en');

MONTH_NAMES(0); // 'January'
```

### Types

| Type          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `DateJson`    | `{ day, month, year }` returned by `dateToJson`              |
| `ElapsedDate` | `{ years, months, days }` returned by `calculateElapsed`     |
| `MonthDay`    | enum with the days of each month (`MonthDay.January` = `31`) |

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
