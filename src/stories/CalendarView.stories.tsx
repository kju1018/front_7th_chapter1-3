import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import CalendarView from '../components/CalendarView';
import { Event } from '../types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '프로젝트 회의',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '12:00',
    description: '프로젝트 진행 상황 논의',
    location: '회의실 A',
    category: '업무',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2024-01-15',
    startTime: '12:30',
    endTime: '13:30',
    description: '동료와 점심',
    location: '레스토랑',
    category: '개인',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '주간 미팅',
    date: '2024-01-16',
    startTime: '09:00',
    endTime: '10:00',
    description: '주간 업무 공유',
    location: '온라인',
    category: '업무',
    repeat: {
      type: 'weekly',
      interval: 1,
      endDate: '2024-03-16',
    },
    notificationTime: 60,
  },
  {
    id: '4',
    title: '운동',
    date: '2024-01-17',
    startTime: '19:00',
    endTime: '20:30',
    description: '헬스장 운동',
    location: '헬스장',
    category: '개인',
    repeat: {
      type: 'daily',
      interval: 1,
    },
    notificationTime: 120,
  },
  {
    id: '5',
    title: '가족 모임',
    date: '2024-01-20',
    startTime: '18:00',
    endTime: '21:00',
    description: '가족 저녁 식사',
    location: '집',
    category: '가족',
    repeat: {
      type: 'monthly',
      interval: 1,
    },
    notificationTime: 1440,
  },
];

const mockHolidays = {
  '2024-01-01': '신정',
  '2024-01-21': '설날',
};

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '월간/주간 캘린더 뷰를 렌더링하는 컴포넌트입니다. 드래그 앤 드롭으로 일정을 이동할 수 있고, 반복 일정과 알림을 표시합니다.',
      },
    },
  },
  argTypes: {
    view: {
      control: { type: 'radio' },
      options: ['week', 'month'],
      description: '캘린더 뷰 타입',
    },
    currentDate: {
      control: { type: 'date' },
      description: '현재 표시할 날짜',
    },
    events: {
      description: '표시할 이벤트 목록',
    },
    notifiedEvents: {
      description: '알림이 표시된 이벤트 ID 목록',
    },
    holidays: {
      description: '공휴일 정보 객체',
    },
    onDragEnd: {
      description: '드래그 앤 드롭 완료 시 호출되는 콜백',
      action: 'dragEnd',
    },
    onCellClick: {
      description: '캘린더 셀 클릭 시 호출되는 콜백',
      action: 'cellClick',
    },
  },
  args: {
    currentDate: new Date('2024-01-15'),
    events: mockEvents,
    notifiedEvents: ['1', '3'],
    holidays: mockHolidays,
    onDragEnd: fn(),
    onCellClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthView: Story = {
  args: {
    view: 'month',
  },
  parameters: {
    docs: {
      description: {
        story: '월간 캘린더 뷰입니다. 한 달의 모든 날짜와 이벤트를 표시합니다.',
      },
    },
  },
};

export const WeekView: Story = {
  args: {
    view: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: '주간 캘린더 뷰입니다. 일주일의 날짜와 이벤트를 표시합니다.',
      },
    },
  },
};

export const EmptyCalendar: Story = {
  args: {
    view: 'month',
    events: [],
    notifiedEvents: [],
    holidays: {},
  },
  parameters: {
    docs: {
      description: {
        story: '이벤트가 없는 빈 캘린더입니다.',
      },
    },
  },
};

export const WithManyEvents: Story = {
  args: {
    view: 'month',
    events: [
      ...mockEvents,
      {
        id: '6',
        title: '아침 조깅',
        date: '2024-01-15',
        startTime: '06:00',
        endTime: '07:00',
        description: '운동',
        location: '공원',
        category: '개인',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '7',
        title: '독서',
        date: '2024-01-15',
        startTime: '20:00',
        endTime: '21:00',
        description: '독서 시간',
        location: '집',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '8',
        title: '영화 감상',
        date: '2024-01-15',
        startTime: '21:30',
        endTime: '23:30',
        description: '영화 보기',
        location: '집',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
      },
    ],
    notifiedEvents: ['1', '3', '6'],
  },
  parameters: {
    docs: {
      description: {
        story: '하루에 여러 이벤트가 있는 경우의 캘린더 뷰입니다.',
      },
    },
  },
};

export const WithHolidays: Story = {
  args: {
    view: 'month',
    holidays: {
      '2024-01-01': '신정',
      '2024-01-15': '한글날',
      '2024-01-21': '설날',
      '2024-01-22': '설날 연휴',
      '2024-01-23': '설날 연휴',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '공휴일이 많이 표시된 캘린더입니다.',
      },
    },
  },
};

export const RepeatingEventsOnly: Story = {
  args: {
    view: 'month',
    events: mockEvents.filter((event) => event.repeat.type !== 'none'),
    notifiedEvents: ['3'],
  },
  parameters: {
    docs: {
      description: {
        story: '반복 일정만 표시된 캘린더입니다. 반복 아이콘과 툴팁을 확인할 수 있습니다.',
      },
    },
  },
};

export const NotifiedEventsOnly: Story = {
  args: {
    view: 'week',
    notifiedEvents: mockEvents.map((event) => event.id),
  },
  parameters: {
    docs: {
      description: {
        story: '모든 이벤트에 알림이 표시된 주간 캘린더입니다.',
      },
    },
  },
};
