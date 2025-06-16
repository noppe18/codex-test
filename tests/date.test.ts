import { dateRange } from '../src/utils/date';

test('dateRange returns inclusive dates', () => {
  const result = dateRange('20250615', '20250617');
  expect(result).toEqual(['20250615', '20250616', '20250617']);
});
