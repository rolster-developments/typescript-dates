import { formatDate } from './lib';

describe('FormatDate', () => {
  it('should generate format with template successful', () => {
    const date = new Date(2024, 4, 30);

    expect(formatDate(date, 'dd, mn del aa')).toBe('30, Mayo del 2024');
    expect(formatDate(date, 'dd - mx del aa')).toBe('30 - May del 2024');
    expect(formatDate(date, 'dd-mm-aa')).toBe('30-05-2024');
  });
});
