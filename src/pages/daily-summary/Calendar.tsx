import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Day from './Calendar/Day';
import './Calendar.css';

const Calendar = () => {
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
    />
  );
};

export default Calendar;
