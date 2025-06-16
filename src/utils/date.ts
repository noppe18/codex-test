export const dateRange = (start: string, end: string): string[] => {
  const result: string[] = [];
  const cur = new Date(
    Number(start.slice(0, 4)),
    Number(start.slice(4, 6)) - 1,
    Number(start.slice(6, 8))
  );
  const endDate = new Date(
    Number(end.slice(0, 4)),
    Number(end.slice(4, 6)) - 1,
    Number(end.slice(6, 8))
  );
  while (cur <= endDate) {
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, '0');
    const dd = String(cur.getDate()).padStart(2, '0');
    result.push(`${yyyy}${mm}${dd}`);
    cur.setDate(cur.getDate() + 1);
  }
  return result;
};
