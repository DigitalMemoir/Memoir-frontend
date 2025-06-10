import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Day from './Calendar/Day';
import './Calendar.css';
import type { IEvent } from '../../types/ICalendar';
import Event from './Calendar/Event';

const Calendar = () => {
  const events: Array<IEvent> = [
    { title: 'Meeting1', start: new Date('2025-6-29'), allDay: true },
    { title: 'Meeting2', start: new Date('2025-6-30'), allDay: true },
  ];
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView={'dayGridMonth'}
      timeZone={'Asia/Seoul'}
      dayHeaders={false}
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
      dayCellContent={Day}
      events={events}
      eventDisplay={'block'}
      eventContent={Event}
    />
  );
};

export default Calendar;
