import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  type DateClickArg,
} from '@fullcalendar/interaction';
import Day from './Calendar/Day';
import './Calendar.css';
import type { IEvent } from '../../types/ICalendar';
import Event from './Calendar/Event';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Header from './Calendar/Header';
import dayjs from 'dayjs';
import type { EventContentArg } from '@fullcalendar/core/index.js';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import { AnimatePresence } from 'motion/react';

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
  const eventRefs = useRef<Record<string, HTMLDivElement>>({});

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const closePopup = useCallback(() => {
    setSelectedDateStr(null);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', closePopup);
    return () => {
      window.removeEventListener('scroll', closePopup);
    };
  }, [closePopup]);

  // 날짜 셀 클릭 시
  const handleDateClick = (info: DateClickArg) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    if (selectedDateStr === info.dateStr) {
      closePopup();
      return;
    }

    // 그 날짜에 이벤트가 하나라도 있으면 selectedDateStr에, 없으면 null
    const exists = api
      .getEvents()
      .some((ev) => ev.start!.toISOString().slice(0, 10) === info.dateStr);

    if (!exists) {
      closePopup();
      return;
    }

    setSelectedDateStr(info.dateStr);
  };

  useLayoutEffect(() => {
    if (!selectedDateStr) return;

    const el = eventRefs.current[selectedDateStr];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const wrapper = document.createElement('div');

    // 팝업 y 위치 계산
    const centerY = rect.top + rect.height / 2;
    // 뷰포트 중앙과 비교
    const tailYPosition = centerY < window.innerHeight / 2 ? 'top' : 'bottom';

    const yPosition: React.CSSProperties =
      tailYPosition === 'top'
        ? {
            // 화면 상단 절반: 팝업을 요소 아래에
            top: `${rect.bottom + 28}px`,
          }
        : {
            // 화면 하단 절반: 팝업을 요소 위에
            bottom: `${window.innerHeight - rect.top + 44}px`,
          };

    // 팝업 x 위치 계산
    const tailXPosition =
      rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';

    const xPosition: React.CSSProperties =
      tailXPosition === 'left'
        ? {
            left: `${rect.left + 160}px`,
            transform: 'translateX(-50%)',
          }
        : {
            right: `${window.innerWidth - rect.right}px`,
            transform: 'translateX(25%)',
          };

    Object.assign(wrapper.style, {
      position: 'fixed',
      zIndex: '10000',
      ...xPosition,
      ...yPosition,
    });

    document.body.appendChild(wrapper);

    const root = createRoot(wrapper);
    root.render(
      <AnimatePresence>
        <Popup
          dateString={selectedDateStr}
          tailYPosition={tailYPosition}
          tailXPosition={tailXPosition}
        />
      </AnimatePresence>
    );

    return () => {
      // exit 애니메이션(0.15s)이 끝나고 DOM 제거
      setTimeout(() => {
        root.unmount();
        wrapper.remove();
      }, 150);
    };
  }, [selectedDateStr]);

  const renderEventContent = (arg: EventContentArg) => {
    return (
      <Event
        ref={(el) => {
          if (el) eventRefs.current[arg.event.startStr] = el;
        }}
        {...arg}
      />
    );
  };

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
        eventContent={renderEventContent}
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
