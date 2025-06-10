import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Day from './Calendar/Day';
import './Calendar.css';
import type { IEvent } from '../../types/ICalendar';
import Event from './Calendar/Event';
import { useEffect, useRef, useState } from 'react';
import Header from './Calendar/Header';
import dayjs from 'dayjs';

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [title, setTitle] = useState<string>('');

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

  const events: Array<IEvent> = [
    { title: 'Meeting1', start: new Date('2025-6-29'), allDay: true },
    { title: 'Meeting2', start: new Date('2025-6-30'), allDay: true },
  ];
  return (
    <div>
      <Header goPrev={goPrev} goNext={goNext} title={title} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView={'dayGridMonth'}
        timeZone={'Asia/Seoul'}
        dayHeaders={false}
        headerToolbar={false}
        dayCellContent={Day}
        events={events}
        eventDisplay={'block'}
        eventContent={Event}
        titleFormat={{
          year: 'numeric',
          month: 'long',
        }}
      />
    </div>
  );
};

export default Calendar;
