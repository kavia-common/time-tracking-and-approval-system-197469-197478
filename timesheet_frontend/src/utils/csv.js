function escapeCSV(value) {
  if (value == null) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// PUBLIC_INTERFACE
export function toCSV(headers, rows) {
  /**
   * headers: string[]
   * rows: Array<Array<string|number>>
   */
  const headerLine = headers.map(escapeCSV).join(',');
  const lines = rows.map((r) => r.map(escapeCSV).join(','));
  return [headerLine, ...lines].join('\n');
}

// PUBLIC_INTERFACE
export function downloadCSV(filename, csvText) {
  /** Triggers a client-side download for the CSV content. */
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
