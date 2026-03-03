export function toCsv(rows: Array<Record<string, any>>) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: any) => `"${String(v ?? '').replaceAll('"', '""')}"`
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('
')
}
