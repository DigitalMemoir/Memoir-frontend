import dayjs from 'dayjs';

export function formatMinutesToTime(minutes: number) {
  const d = dayjs.duration(minutes, 'minutes');
  const hours = d.hours();
  const mins = d.minutes();
  return `${hours}시간 ${mins}분`;
}
