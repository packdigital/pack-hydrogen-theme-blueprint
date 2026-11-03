/*
 * Shipping cutoff math. Deadlines are anchored to the warehouse timezone so
 * every shopper sees the same order-by moment regardless of their own clock.
 * Pure functions (no React, no Date.now()) so they're easy to test.
 */

export interface ShippingCutoffInput {
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM, 24-hour, warehouse timezone
  message: string;
}

export interface ActiveShippingCutoff {
  deadline: number; // epoch ms
  message: string;
}

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_REGEX = /^(\d{1,2}):(\d{2})$/;

/**
 * Offset in ms between the given timezone's wall clock and UTC at an instant.
 * Throws RangeError for an invalid timezone.
 */
export const getTimeZoneOffsetMs = (instant: number, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const wallClockAsUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return wallClockAsUtc - Math.floor(instant / 1000) * 1000;
};

/**
 * Converts a wall-clock date and time in a timezone to epoch ms. Returns null
 * when the date, time or timezone is invalid.
 */
export const zonedTimeToEpochMs = (
  date: string,
  time: string,
  timeZone: string,
): number | null => {
  const dateMatch = date?.trim().match(DATE_REGEX);
  const timeMatch = (time?.trim() || '00:00').match(TIME_REGEX);
  if (!dateMatch || !timeMatch) return null;
  const [, year, month, day] = dateMatch.map(Number);
  const [, hour, minute] = timeMatch.map(Number);
  if (hour > 23 || minute > 59) return null;
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  if (Number.isNaN(naive)) return null;
  try {
    // Second pass corrects the guess when the deadline sits across a DST change
    const firstGuess = naive - getTimeZoneOffsetMs(naive, timeZone);
    return naive - getTimeZoneOffsetMs(firstGuess, timeZone);
  } catch {
    return null;
  }
};

/**
 * The earliest cutoff whose deadline hasn't passed yet. Returns null when
 * there are no valid cutoffs left. `allPassed` is true only when at least
 * one valid cutoff exists and every one is in the past.
 */
export const getActiveShippingCutoff = ({
  cutoffs = [],
  now,
  timeZone,
}: {
  cutoffs: ShippingCutoffInput[];
  now: number;
  timeZone: string;
}): {active: ActiveShippingCutoff | null; allPassed: boolean} => {
  const deadlines = cutoffs
    .map((cutoff) => ({
      deadline: zonedTimeToEpochMs(cutoff.date, cutoff.time || '', timeZone),
      message: cutoff.message,
    }))
    .filter(
      (cutoff): cutoff is ActiveShippingCutoff =>
        cutoff.deadline !== null && !!cutoff.message,
    )
    .sort((a, b) => a.deadline - b.deadline);

  const active = deadlines.find(({deadline}) => deadline > now) || null;
  return {active, allPassed: !active && deadlines.length > 0};
};

/**
 * "2d 4h", "4h 23m" or "23m". Floors to the minute so the countdown never
 * reads more time than is left.
 */
export const formatCutoffCountdown = (ms: number) => {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Fills {{date}} (order-by date in the warehouse timezone, e.g. "Dec 15")
 * and {{countdown}} (time remaining) in a cutoff message.
 */
export const formatShippingCutoffMessage = ({
  cutoff,
  now,
  timeZone,
}: {
  cutoff: ActiveShippingCutoff;
  now: number;
  timeZone: string;
}) => {
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
  }).format(new Date(cutoff.deadline));
  return cutoff.message
    .replaceAll('{{date}}', date)
    .replaceAll('{{countdown}}', formatCutoffCountdown(cutoff.deadline - now));
};
