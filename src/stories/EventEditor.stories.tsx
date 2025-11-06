import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import { EventEditor } from '../components/EventEditor';

const meta: Meta<typeof EventEditor> = {
  title: 'Forms/EventEditor',
  component: EventEditor,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: '',
    setTitle: fn(),
    date: '',
    setDate: fn(),
    startTime: '',
    endTime: '',
    description: '',
    setDescription: fn(),
    location: '',
    setLocation: fn(),
    category: '업무',
    setCategory: fn(),
    isRepeating: false,
    setIsRepeating: fn(),
    repeatType: 'daily',
    setRepeatType: fn(),
    repeatInterval: 1,
    setRepeatInterval: fn(),
    repeatEndDate: '',
    setRepeatEndDate: fn(),
    notificationTime: 10,
    setNotificationTime: fn(),
    startTimeError: null,
    endTimeError: null,
    editingEvent: null,
    handleStartTimeChange: fn(),
    handleEndTimeChange: fn(),
    addOrUpdateEvent: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof EventEditor>;

export const Empty: Story = {
  args: {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '업무',
    isRepeating: false,
    notificationTime: 10,
    editingEvent: null,
  },
};

export const PartiallyFilledEvent: Story = {
  args: {
    title: '팀 미팅',
    date: '2025-11-08',
    startTime: '13:00',
    endTime: '14:00',
    description: '',
    location: '',
    category: '업무',
    isRepeating: false,
    notificationTime: 10,
    editingEvent: null,
  },
};

export const CompleteEvent: Story = {
  args: {
    title: '클라이언트 미팅',
    date: '2025-11-10',
    startTime: '14:00',
    endTime: '15:30',
    description: '신규 프로젝트 논의 및 요구사항 확인',
    location: '온라인 (Zoom)',
    category: '업무',
    isRepeating: false,
    notificationTime: 60,
    editingEvent: null,
  },
};

export const DailyRepeatingEvent: Story = {
  args: {
    title: '아침 스탠드업',
    date: '2025-11-08',
    startTime: '09:00',
    endTime: '09:30',
    description: '팀 일일 회의',
    location: '온라인',
    category: '업무',
    isRepeating: true,
    repeatType: 'daily',
    repeatInterval: 1,
    repeatEndDate: '2025-12-31',
    notificationTime: 10,
    editingEvent: null,
  },
};

export const WeeklyRepeatingEvent: Story = {
  args: {
    title: '주간 1:1 면담',
    date: '2025-11-10',
    startTime: '15:00',
    endTime: '16:00',
    description: '개인 업무 평가',
    location: '회의실 B',
    category: '업무',
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 10,
    editingEvent: null,
  },
};

export const MonthlyRepeatingEvent: Story = {
  args: {
    title: '월간 리포팅',
    date: '2025-11-08',
    startTime: '11:00',
    endTime: '12:00',
    description: '월간 성과 공유',
    location: '본사',
    category: '업무',
    isRepeating: true,
    repeatType: 'monthly',
    repeatInterval: 1,
    repeatEndDate: '2025-12-31',
    notificationTime: 60,
    editingEvent: null,
  },
};

export const YearlyRepeatingEvent: Story = {
  args: {
    title: '회사 창립기념일',
    date: '2025-11-15',
    startTime: '10:00',
    endTime: '12:00',
    description: '창립기념 행사',
    location: '본사',
    category: '기타',
    isRepeating: true,
    repeatType: 'yearly',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 1440,
    editingEvent: null,
  },
};

export const EditingMode: Story = {
  args: {
    title: '수정할 일정',
    date: '2025-11-08',
    startTime: '13:00',
    endTime: '14:00',
    description: '기존 일정을 수정 중입니다',
    location: '회의실',
    category: '업무',
    isRepeating: false,
    notificationTime: 10,
    editingEvent: {
      id: '1',
      title: '수정할 일정',
      date: '2025-11-08',
      startTime: '13:00',
      endTime: '14:00',
      location: '회의실',
      description: '기존 일정을 수정 중입니다',
      repeat: { type: 'none', interval: 0 },
      category: '업무',
      notificationTime: 10,
    },
  },
};
