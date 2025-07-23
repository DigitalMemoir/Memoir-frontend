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
import {
  showInfoToast,
  showLoadingToast,
} from '../../components/Toast/showToast';
import Loading from '../../components/Loading';
import useOnClickOutside from '../../hooks/useOnClickOutside';

// 팝업 위치 계산 타입
interface PopupPosition {
  xPosition: React.CSSProperties;
  yPosition: React.CSSProperties;
  tailXPosition: 'left' | 'right';
  tailYPosition: 'top' | 'bottom';
}

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState<string>('');
  const eventRefs = useRef<Record<string, HTMLDivElement>>({});
  const queryClient = useQueryClient();

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [loadingDateStr, setLoadingDateStr] = useState<Array<string>>([]);
  const mutateAsync = useGenerateDateSummary();

  const closePopup = useCallback(() => {
    setSelectedDateStr(null);
  }, []);

  // useOnClickOutside 훅 사용
  useOnClickOutside(popupRef, closePopup);

  // 스크롤 시에도 팝업 닫기 (기존 기능 유지)
  useEffect(() => {
    window.addEventListener('scroll', closePopup);
    return () => {
      window.removeEventListener('scroll', closePopup);
    };
  }, [closePopup]);

  // 팝업 위치 계산 함수
  const calculatePopupPosition = useCallback(
    (dateStr: string): PopupPosition | null => {
      const el = eventRefs.current[dateStr];
      if (!el) return null;

      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const tailYPosition = centerY < window.innerHeight / 2 ? 'top' : 'bottom';

      const yPosition: React.CSSProperties =
        tailYPosition === 'top'
          ? { top: `${rect.bottom + rect.height + 8}px` }
          : { bottom: `${window.innerHeight - rect.top + rect.height + 8}px` };

      const tailXPosition =
        rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
      const arrowOffset = 160;
      const centerX = rect.left + rect.width / 2;

      const xPosition: React.CSSProperties =
        tailXPosition === 'left'
          ? { left: centerX - arrowOffset + 'px' }
          : { left: centerX - (524 - arrowOffset) + 'px' };

      return { xPosition, yPosition, tailXPosition, tailYPosition };
    },
    []
  );

  // 날짜 요약 생성 함수
  const generateDateSummary = useCallback(
    async (dateStr: string) => {
      if (loadingDateStr.includes(dateStr)) {
        showInfoToast(
          `${dayjs(dateStr).format('YYYY년 M월 D일')}의 요약이 이미 생성 중입니다.`
        );
        return;
      }

      setLoadingDateStr((prev) => [...prev, dateStr]);

      try {
        await showLoadingToast({
          loadingMsg: `${dayjs(dateStr).format('YYYY년 M월 D일')}의 요약을 생성 중입니다.`,
          successMsg: `${dayjs(dateStr).format('YYYY년 M월 D일')}의 요약이 생성되었습니다.`,
          errorMsg: `${dayjs(dateStr).format('YYYY년 M월 D일')}의 요약 생성에 실패했습니다.`,
          asyncFn: async () => {
            await mutateAsync(dateStr);
          },
        });

        queryClient.invalidateQueries({
          queryKey: ['calendar', title],
        });
      } finally {
        setLoadingDateStr((prev) => prev.filter((date) => date !== dateStr));
      }
    },
    [loadingDateStr, mutateAsync, queryClient, title]
  );

  // 날짜 셀 클릭 핸들러
  const handleDateClick = useCallback(
    (info: DateClickArg) => {
      console.log('handleDateClick', info.dateStr);

      // 오늘 이후 날짜 클릭 방지
      const today = dayjs();
      const clickedDate = dayjs(info.dateStr);

      if (clickedDate.isAfter(today, 'day')) {
        console.log('Future date clicked - ignoring');
        return; // 미래 날짜 클릭 시 아무것도 하지 않음
      }

      const api = calendarRef.current?.getApi();
      if (!api) return;

      // 같은 날짜 클릭 시 팝업 토글
      if (selectedDateStr === info.dateStr) {
        closePopup();
        return;
      }

      // 그 날짜에 이벤트가 있는지 확인
      const hasEvents = api
        .getEvents()
        .some((ev) => ev.start!.toISOString().slice(0, 10) === info.dateStr);

      if (hasEvents) {
        // 이벤트가 있으면 팝업 표시
        setSelectedDateStr(info.dateStr);
      } else {
        // 이벤트가 없으면 요약 생성
        generateDateSummary(info.dateStr);
        closePopup();
      }
    },
    [selectedDateStr, closePopup, generateDateSummary]
  );

  // 팝업 렌더링
  useLayoutEffect(() => {
    if (!selectedDateStr) return;

    const position = calculatePopupPosition(selectedDateStr);
    if (!position) return;

    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'fixed',
      zIndex: '10000',
      ...position.xPosition,
      ...position.yPosition,
    });

    document.body.appendChild(wrapper);

    // wrapper를 popupRef로 설정
    popupRef.current = wrapper;

    const root = createRoot(wrapper);
    root.render(
      <AnimatePresence>
        <QueryClientProvider client={queryClient}>
          <Popup
            dateString={selectedDateStr}
            tailYPosition={position.tailYPosition}
            tailXPosition={position.tailXPosition}
          />
        </QueryClientProvider>
      </AnimatePresence>
    );

    return () => {
      // exit 애니메이션(0.15s)이 끝나고 DOM 제거
      setTimeout(() => {
        root.unmount();
        wrapper.remove();
        // ref 정리
        if (popupRef.current === wrapper) {
          popupRef.current = null;
        }
      }, 150);
    };
  }, [selectedDateStr, calculatePopupPosition, queryClient]);

  // 이벤트 렌더링
  const renderEventContent = useCallback((arg: EventContentArg) => {
    return (
      <Event
        ref={(el) => {
          if (el) eventRefs.current[arg.event.startStr] = el;
        }}
        {...arg}
      />
    );
  }, []);

  // 캘린더 제목 업데이트
  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const updateTitle = () => {
      const view = api.view;
      const currentDate = view.currentStart;
      const formatted = dayjs(currentDate).locale('en').format('MMMM, YYYY');
      setTitle(formatted);
    };

    updateTitle();
    api.on('datesSet', updateTitle);

    return () => {
      api.off('datesSet', updateTitle);
    };
  }, []);

  // 캘린더 네비게이션
  const goPrev = useCallback(() => {
    calendarRef.current?.getApi().prev();
  }, []);

  const goNext = useCallback(() => {
    calendarRef.current?.getApi().next();
  }, []);

  // 캘린더 데이터 조회
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

  if (error) {
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
      <Loading
        isLoading={isLoading || !events}
        className={'z-1000 fixed top-0 left-0 w-full h-full'}
      />
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
          // 오늘까지만 선택 가능하도록 제한
          validRange={{
            end: dayjs().add(1, 'day').format('YYYY-MM-DD'), // 내일부터 비활성화
          }}
          // 추가적인 스타일링을 위한 dayCellClassNames
          dayCellClassNames={(arg) => {
            const today = dayjs();
            const cellDate = dayjs(arg.date);

            if (cellDate.isAfter(today, 'day')) {
              return ['fc-day-disabled']; // 미래 날짜에 클래스 추가
            }
            return [];
          }}
        />
      </div>
    </motion.div>
  );
};

export default Calendar;
