import dayjs from 'dayjs';
import axiosInstance from '../../../lib/axiosInstance';

export const getCalendarData = async (date: string) => {
  const formatDate = dayjs(date).format('YYYY-MM');
  const res = await axiosInstance.get(`/api/monthly/${formatDate}`);
  return res.data.data.calendarData.map(
    (event: { title: string; date: string }) => ({
      title: event.title,
      start: new Date(event.date),
      allDay: true,
    })
  );
};
