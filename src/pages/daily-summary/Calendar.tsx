import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  type DateClickArg,
} from '@fullcalendar/interaction';
import Day from './Calendar/Day';
import './Calendar.css';
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
import { AnimatePresence, motion } from 'motion/react';
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useGenerateDateSummary } from './api/useGenerateDateSummary';
import { getCalendarData } from './api/getCalendarData';

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [title, setTitle] = useState<string>('');
  const eventRefs = useRef<Record<string, HTMLDivElement>>({});
  const queryClient = useQueryClient();

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [loadingDateStr, setLoadingDateStr] = useState<Array<string>>([]);
  const mutateAsync = useGenerateDateSummary();

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
    console.log('handleDateClick', info.dateStr);
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
      if (!loadingDateStr.includes(info.dateStr)) {
        setLoadingDateStr((prev) => [...prev, info.dateStr]);
        mutateAsync(info.dateStr).then(() => {
          setLoadingDateStr((prev) =>
            prev.filter((date) => date !== info.dateStr)
          );
          queryClient.invalidateQueries({
            queryKey: ['calendar', title],
          });
        });
      } else {
        // 로딩중이라고 토스트 띄우기!
      }
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
            top: `${rect.bottom + rect.height + 8}px`,
          }
        : {
            // 화면 하단 절반: 팝업을 요소 위에
            bottom: `${window.innerHeight - rect.top + rect.height + 8}px`,
          };

    // 팝업 x 위치 계산
    const tailXPosition =
      rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';

    const arrowOffset = 160;
    const centerX = rect.left + rect.width / 2;
    console.log('centerX', centerX);

    const xPosition: React.CSSProperties =
      tailXPosition === 'left'
        ? {
            left: centerX - arrowOffset + 'px',
          }
        : {
            left: centerX - (524 - arrowOffset) + 'px',
          };

    console.log('window.innerWidth', window.innerWidth);
    console.log('rect.right', rect.right);
    console.log('xPosition', xPosition?.left);
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
        <QueryClientProvider client={queryClient}>
          <Popup
            dateString={selectedDateStr}
            tailYPosition={tailYPosition}
            tailXPosition={tailXPosition}
          />
        </QueryClientProvider>
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
      const formatted = dayjs(currentDate).locale('en').format('MMMM, YYYY');
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

  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['calendar', title],
    queryFn: () => getCalendarData(title),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!calendarRef.current && !!title,
  });

  if (isLoading) {
    return (
      <div className={'w-full h-full flex items-center justify-center'}>
        Loading...
      </div>
    );
  }

  if (error) {
    console.error('Error fetching calendar data:', error);
    return (
      <div className={'w-full h-full flex items-center justify-center'}>
        Error loading calendar
      </div>
    );
  }

  return (
    <motion.div
      className={'w-full h-full flex flex-col items-center'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Header goPrev={goPrev} goNext={goNext} title={title} />
      <div className={'h-full w-auto aspect-[4/3] box-border pb-30'}>
        <FullCalendar
          height={'100%'}
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
    </motion.div>
  );
};

export default Calendar;
