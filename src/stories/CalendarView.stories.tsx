import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import { CalendarView } from '../components/CalendarView';

const meta: Meta<typeof CalendarView> = {
  title: 'Calendar/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen', // 전체 뷰로 보기 좋게
  },
  args: {
    setView: fn(),
    navigate: fn(),
    handleCellClick: fn(),
    handleDragStart: fn(),
    handleDragEnd: fn(),
    holidays: {},
    notifiedEvents: [],
    filteredEvents: [],
    activeEvent: null,
    currentDate: new Date('2025-11-08'),
  },
};
export default meta;

type Story = StoryObj<typeof CalendarView>;

/**
 * ✅ 주간 보기 렌더링 테스트
 */
export const WeekView: Story = {
  args: {
    view: 'week',
  },
};

/**
 * ✅ 월간 보기 렌더링 테스트
 */
export const MonthView: Story = {
  args: {
    view: 'month',
  },
};

export const WeekViewWithEvents: Story = {
  args: {
    view: 'week',
    filteredEvents: [
      {
        id: '1',
        title: '팀 미팅',
        date: '2025-11-08',
        startTime: '13:00',
        endTime: '14:00',
        location: '회의실 A',
        description: '프로젝트 진행 상황 공유',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 10,
      },
      {
        id: '2',
        title: '코드 리뷰',
        date: '2025-11-07',
        startTime: '15:00',
        endTime: '16:00',
        location: '온라인',
        description: '프론트엔드 코드 품질 점검',
        repeat: { type: 'none', interval: 0 },
        category: '개발',
        notificationTime: 5,
      },
    ],
  },
};

export const MonthViewWithEvents: Story = {
  args: {
    view: 'month',
    filteredEvents: [
      {
        id: '3',
        title: '11월 일정 점검',
        date: '2025-11-08',
        startTime: '09:00',
        endTime: '10:00',
        location: '본사',
        description: '월간 일정 검토 회의',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 10,
      },
      {
        id: '4',
        title: '연말 회식 준비',
        date: '2025-11-28',
        startTime: '18:00',
        endTime: '20:00',
        location: '강남',
        description: '팀 회식 준비 회의',
        repeat: { type: 'none', interval: 0 },
        category: '행사',
        notificationTime: 30,
      },
      {
        id: '5',
        title: '팀 워크샵',
        date: '2025-11-14',
        startTime: '10:00',
        endTime: '17:00',
        location: '양평',
        description: '연말 워크샵',
        repeat: { type: 'none', interval: 0 },
        category: '행사',
        notificationTime: 60,
      },
    ],
  },
};

export const WeekViewWithNotifications: Story = {
  args: {
    view: 'week',
    filteredEvents: [
      {
        id: '6',
        title: '긴급 회의',
        date: '2025-11-08',
        startTime: '10:00',
        endTime: '11:00',
        location: '회의실',
        description: '긴급 프로젝트 회의',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 15,
      },
      {
        id: '7',
        title: '클라이언트 미팅',
        date: '2025-11-10',
        startTime: '14:00',
        endTime: '15:30',
        location: '온라인',
        description: '신규 프로젝트 논의',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 30,
      },
    ],
    notifiedEvents: ['6', '7'], // 알림이 온 이벤트들
  },
};

export const WeekViewWithRecurringEvents: Story = {
  args: {
    view: 'week',
    filteredEvents: [
      {
        id: '8',
        title: '일일 아침 스탠드업',
        date: '2025-11-08',
        startTime: '09:00',
        endTime: '09:30',
        location: '온라인',
        description: '팀 일일 회의',
        repeat: { type: 'daily', interval: 1 },
        category: '업무',
        notificationTime: 10,
      },
      {
        id: '9',
        title: '주간 1:1 면담',
        date: '2025-11-10',
        startTime: '15:00',
        endTime: '16:00',
        location: '회의실 B',
        description: '개인 업무 평가',
        repeat: { type: 'weekly', interval: 1 },
        category: '업무',
        notificationTime: 15,
      },
      {
        id: '10',
        title: '월간 리포팅',
        date: '2025-11-08',
        startTime: '11:00',
        endTime: '12:00',
        location: '본사',
        description: '월간 성과 공유',
        repeat: { type: 'monthly', interval: 1 },
        category: '업무',
        notificationTime: 60,
      },
    ],
  },
};

export const MonthViewWithRecurringEvents: Story = {
  args: {
    view: 'month',
    filteredEvents: [
      {
        id: '11',
        title: '일일 운동',
        date: '2025-11-01',
        startTime: '06:00',
        endTime: '07:00',
        location: '헬스장',
        description: '아침 운동',
        repeat: { type: 'daily', interval: 1 },
        category: '개인',
        notificationTime: 15,
      },
      {
        id: '12',
        title: '주말 쇼핑',
        date: '2025-11-08',
        startTime: '14:00',
        endTime: '18:00',
        location: '쇼핑몰',
        description: '주말 장보기',
        repeat: { type: 'weekly', interval: 1 },
        category: '개인',
        notificationTime: 30,
      },
      {
        id: '13',
        title: '생일 축하',
        date: '2025-11-15',
        startTime: '19:00',
        endTime: '21:00',
        location: '식당',
        description: '친구 생일 파티',
        repeat: { type: 'yearly', interval: 1 },
        category: '행사',
        notificationTime: 120,
      },
    ],
  },
};

export const WeekViewWithNotificationsAndRecurring: Story = {
  args: {
    view: 'week',
    filteredEvents: [
      {
        id: '14',
        title: '매일 아침 스탠드업 (알림)',
        date: '2025-11-08',
        startTime: '09:00',
        endTime: '09:30',
        location: '온라인',
        description: '팀 일일 회의',
        repeat: { type: 'daily', interval: 1 },
        category: '업무',
        notificationTime: 15,
      },
      {
        id: '15',
        title: '중요 주간 회의 (알림)',
        date: '2025-11-10',
        startTime: '10:00',
        endTime: '11:00',
        location: '회의실 A',
        description: '프로젝트 진행 상황 공유',
        repeat: { type: 'weekly', interval: 1 },
        category: '업무',
        notificationTime: 30,
      },
      {
        id: '16',
        title: '일반 반복 일정',
        date: '2025-11-12',
        startTime: '14:00',
        endTime: '15:00',
        location: '온라인',
        description: '정기 교육',
        repeat: { type: 'weekly', interval: 2 },
        category: '개발',
        notificationTime: 10,
      },
    ],
    notifiedEvents: ['14', '15'], // 알림이 온 일정들만 강조
  },
};

export const MonthViewWithNotificationsAndRecurring: Story = {
  args: {
    view: 'month',
    filteredEvents: [
      {
        id: '17',
        title: '긴급: 일일 체크인',
        date: '2025-11-01',
        startTime: '09:00',
        endTime: '09:15',
        location: '온라인',
        description: '팀 일일 확인',
        repeat: { type: 'daily', interval: 1 },
        category: '업무',
        notificationTime: 10,
      },
      {
        id: '18',
        title: '중요: 월간 회의',
        date: '2025-11-08',
        startTime: '10:00',
        endTime: '11:30',
        location: '본사',
        description: '월간 성과 검토',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-12-31' },
        category: '업무',
        notificationTime: 60,
      },
      {
        id: '19',
        title: '주간 정례 회의',
        date: '2025-11-10',
        startTime: '14:00',
        endTime: '15:00',
        location: '회의실 B',
        description: '팀 주간 계획',
        repeat: { type: 'weekly', interval: 1 },
        category: '업무',
        notificationTime: 15,
      },
      {
        id: '20',
        title: '일반 일정',
        date: '2025-11-20',
        startTime: '16:00',
        endTime: '17:00',
        location: '온라인',
        description: '개인 학습',
        repeat: { type: 'none', interval: 0 },
        category: '개인',
        notificationTime: 30,
      },
    ],
    notifiedEvents: ['17', '18'], // 긴급 일정들만 알림 표시
  },
};

export const MonthViewWithHolidays: Story = {
  args: {
    view: 'month',
    holidays: {
      '2025-11-03': '문화의 날',
    },
    filteredEvents: [
      {
        id: '21',
        title: '연휴 여행 계획',
        date: '2025-11-03',
        startTime: '09:00',
        endTime: '18:00',
        location: '제주도',
        description: '문화의 날 여행',
        repeat: { type: 'none', interval: 0 },
        category: '여행',
        notificationTime: 120,
      },
    ],
  },
};

export const ComplexMonthViewScenario: Story = {
  args: {
    view: 'month',
    holidays: {
      '2025-11-03': '문화의 날',
    },
    filteredEvents: [
      // 긴급 알림 + 일일 반복
      {
        id: '22',
        title: '매일 아침 미팅',
        date: '2025-11-08',
        startTime: '09:00',
        endTime: '09:30',
        location: '온라인',
        description: '팀 스탠드업',
        repeat: { type: 'daily', interval: 1 },
        category: '업무',
        notificationTime: 15,
      },
      // 알림 + 주간 반복
      {
        id: '23',
        title: '주간 1:1 면담',
        date: '2025-11-10',
        startTime: '15:00',
        endTime: '16:00',
        location: '회의실 B',
        description: '개인 평가면담',
        repeat: { type: 'weekly', interval: 1 },
        category: '업무',
        notificationTime: 30,
      },
      // 반복 없음 + 알림
      {
        id: '24',
        title: '중요: 클라이언트 프레젠테이션',
        date: '2025-11-12',
        startTime: '14:00',
        endTime: '16:00',
        location: '클라이언트 사무실',
        description: '분기 성과 보고',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 120,
      },
      // 월간 반복 + 종료일 설정
      {
        id: '25',
        title: '월간 리포팅',
        date: '2025-11-08',
        startTime: '11:00',
        endTime: '12:00',
        location: '본사',
        description: '월간 성과 공유',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-12-31' },
        category: '업무',
        notificationTime: 60,
      },
      // 알림 + 연간 반복
      {
        id: '26',
        title: '회사 창립기념일',
        date: '2025-11-15',
        startTime: '10:00',
        endTime: '12:00',
        location: '본사',
        description: '창립기념 행사',
        repeat: { type: 'yearly', interval: 1 },
        category: '행사',
        notificationTime: 480,
      },
      // 복합: 2주 반복
      {
        id: '27',
        title: '격주 팀 회의',
        date: '2025-11-10',
        startTime: '10:00',
        endTime: '11:00',
        location: '회의실 A',
        description: '팀 전체 회의',
        repeat: { type: 'weekly', interval: 2 },
        category: '업무',
        notificationTime: 15,
      },
      // 반복 없는 일반 일정
      {
        id: '28',
        title: '개인 휴가',
        date: '2025-11-20',
        startTime: '00:00',
        endTime: '23:59',
        location: '휴가',
        description: '연차 사용',
        repeat: { type: 'none', interval: 0 },
        category: '개인',
        notificationTime: 1440,
      },
    ],
    notifiedEvents: ['22', '23', '24', '26'], // 일부 일정만 알림 표시
  },
};
