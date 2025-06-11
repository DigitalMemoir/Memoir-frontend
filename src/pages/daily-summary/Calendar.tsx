import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  type DateClickArg,
} from '@fullcalendar/interaction';
import Day from './Calendar/Day';
import './Calendar.css';
import type { IEvent } from '../../types/ICalendar';
import Event from './Calendar/Event';
import { useEffect, useRef, useState } from 'react';
import Header from './Calendar/Header';
import dayjs from 'dayjs';

const events: Array<IEvent> = [
  { title: 'Meeting', start: new Date('2025-6-1'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-2'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-3'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-4'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-5'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-6'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-7'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-8'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-9'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-10'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-11'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-12'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-13'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-14'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-15'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-16'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-17'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-18'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-19'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-20'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-21'), allDay: true },
  { title: 'Meeting', start: new Date('2025-6-22'), allDay: true },
  { title: 'Meeting1', start: new Date('2025-6-29'), allDay: true },
  { title: 'Meeting2', start: new Date('2025-6-30'), allDay: true },
];

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [title, setTitle] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const updateTitle = () => {
      const view = api.view;
      const currentDate = view.currentStart;

      // Day.js로 포맷팅
      const formatted = dayjs(currentDate).format('MMMM, YYYY');
      setTitle(formatted); // "May, 2025"
    };

    updateTitle(); // 최초 설정
    api.on('datesSet', updateTitle); // 날짜 변경 시마다 title 업데이트

    return () => {
      api.off('datesSet', updateTitle); // cleanup
    };
  }, []);

  const goPrev = () => {
    calendarRef.current?.getApi().prev();
  };

  const goNext = () => {
    calendarRef.current?.getApi().next();
  };

  // 날짜 클릭 시: 그 날짜의 이벤트들을 찾아 state에 저장
  const handleDateClick = (info: DateClickArg) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    console.log('Clicked date:', info.dateStr);
    // YYYY-MM-DD 기준으로 필터
    const eventsOnDate = api
      .getEvents()
      .filter((e) => e.startStr.startsWith(info.dateStr))
      .map((e) => e.startStr);

    if (eventsOnDate.length > 0) {
      setSelectedDate(info.dateStr);
    } else {
      setSelectedDate('');
    }
  };

  return (
    <div>
      <Header goPrev={goPrev} goNext={goNext} title={title} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={'dayGridMonth'}
        timeZone={'Asia/Seoul'}
        dayHeaders={false}
        headerToolbar={false}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        dayCellContent={Day}
        events={events}
        eventDisplay={'block'}
        eventContent={(arg) => (
          <Event popupOpen={selectedDate === arg.event.startStr} {...arg} />
        )}
        titleFormat={{
          year: 'numeric',
          month: 'long',
        }}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default Calendar;
