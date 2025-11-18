import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

// PUBLIC_INTERFACE
export function getWeekStart(date = new Date()) {
  /** Returns a Dayjs for the Monday (ISO) of the week containing date. */
  return dayjs(date).isoWeekday(1).startOf('day');
}

// PUBLIC_INTERFACE
export function getWeekDays(weekStartDate) {
  /** Returns an array of 7 Dayjs objects from Monday..Sunday */
  const start = getWeekStart(weekStartDate);
  return Array.from({ length: 7 }).map((_, idx) => start.add(idx, 'day'));
}

// PUBLIC_INTERFACE
export function formatDay(d) {
  /** Format like Mon 18 Nov */
  return dayjs(d).format('ddd DD MMM');
}

// PUBLIC_INTERFACE
export function toISODate(d) {
  /** YYYY-MM-DD for stable keys */
  return dayjs(d).format('YYYY-MM-DD');
}

// PUBLIC_INTERFACE
export function calcTotals(entriesByDay) {
  /**
   * entriesByDay: Record<YYYY-MM-DD, Array<{ projectId, taskId, hours:number }>>
   * Returns { perDay: Record<date, number>, perProject: Record<projectId, number>, weekTotal: number }
   */
  const perDay = {};
  const perProject = {};
  let weekTotal = 0;

  Object.entries(entriesByDay || {}).forEach(([date, rows]) => {
    const sum = (rows || [])
      .filter((r) => !Number.isNaN(Number(r.hours)))
      .reduce((acc, r) => acc + Number(r.hours || 0), 0);
    perDay[date] = sum;
    weekTotal += sum;
    (rows || []).forEach((r) => {
      if (r.projectId) perProject[r.projectId] = (perProject[r.projectId] || 0) + Number(r.hours || 0);
    });
  });

  return { perDay, perProject, weekTotal };
}

// PUBLIC_INTERFACE
export function validateWeek(entriesByDay, maxDailyHours = 24, maxWeeklyHours = 80) {
  /**
   * Perform simple validations:
   * - hours per row >= 0
   * - per day total <= maxDailyHours
   * - per week total <= maxWeeklyHours
   * - project and task for rows with hours
   * Returns: { valid: boolean, issues: string[] }
   */
  const issues = [];
  const { perDay, weekTotal } = calcTotals(entriesByDay);

  // per row checks
  Object.entries(entriesByDay || {}).forEach(([date, rows]) => {
    (rows || []).forEach((r, idx) => {
      const h = Number(r.hours || 0);
      if (h < 0) issues.push(`Negative hours on ${date} row ${idx + 1}`);
      if (h > 0 && !r.projectId) issues.push(`Missing project on ${date} row ${idx + 1}`);
      if (h > 0 && !r.taskId) issues.push(`Missing task on ${date} row ${idx + 1}`);
    });
  });

  // day limit
  Object.entries(perDay).forEach(([date, sum]) => {
    if (sum > maxDailyHours) issues.push(`Daily total exceeds ${maxDailyHours} on ${date}`);
  });

  // week limit
  if (weekTotal > maxWeeklyHours) issues.push(`Weekly total exceeds ${maxWeeklyHours}`);

  return { valid: issues.length === 0, issues };
}

// PUBLIC_INTERFACE
export function storageKeyForWeek(weekStartDate, userId = 'anon') {
  /** Key used for localStorage autosave for a specific user-week. */
  const wk = getWeekStart(weekStartDate).format('YYYY-[W]ww');
  return `chronose.weeklyDraft.${userId}.${wk}`;
}

// PUBLIC_INTERFACE
export function loadDraft(weekStartDate, userId = 'anon') {
  /** Load saved draft from localStorage, or empty structure */
  try {
    const raw = localStorage.getItem(storageKeyForWeek(weekStartDate, userId));
    if (!raw) return { entriesByDay: {}, absencesByDay: {}, meta: {} };
    const parsed = JSON.parse(raw);
    return parsed || { entriesByDay: {}, absencesByDay: {}, meta: {} };
  } catch {
    return { entriesByDay: {}, absencesByDay: {}, meta: {} };
  }
}

// PUBLIC_INTERFACE
export function saveDraft(weekStartDate, userId, draft) {
  /** Save draft to localStorage */
  try {
    localStorage.setItem(storageKeyForWeek(weekStartDate, userId), JSON.stringify(draft));
  } catch {
    // ignore
  }
}
