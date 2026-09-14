import { hours, type Day } from '../data/site';

/** 570 → « 9 h 30 », 1140 → « 19 h 00 » */
export function formatTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} h ${String(m).padStart(2, '0')}`;
}

export function formatRange(d: Day): string {
  return d.open === null || d.close === null
    ? 'Fermé'
    : `${formatTime(d.open)} – ${formatTime(d.close)}`;
}

/** Codes jour attendus par schema.org, dans l'ordre de notre tableau. */
const SCHEMA_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const iso = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

export function openingHoursSpecification() {
  return hours
    .filter((d) => d.open !== null && d.close !== null)
    .map((d) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_DAYS[d.day],
      opens: iso(d.open as number),
      closes: iso(d.close as number),
    }));
}

/** 45 → « 45 min », 90 → « 1 h 30 », 120 → « 2 h » */
export function formatDuration(mins: number | null): string {
  if (mins === null) return '—';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m}`;
}
