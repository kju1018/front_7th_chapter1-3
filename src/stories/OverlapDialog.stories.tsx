import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import { OverlapDialog } from '../components/OverlapDialog';

const meta: Meta<typeof OverlapDialog> = {
  title: 'Dialogs/OverlapDialog',
  component: OverlapDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: false,
    onClose: fn(),
    onConfirm: fn(),
    overlappingEvents: [],
  },
};

export default meta;
type Story = StoryObj<typeof OverlapDialog>;

export const Closed: Story = {
  args: {
    open: false,
    overlappingEvents: [],
  },
};

export const SingleOverlappingEvent: Story = {
  args: {
    open: true,
    overlappingEvents: [
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
    ],
  },
};

export const MultipleOverlappingEvents: Story = {
  args: {
    open: true,
    overlappingEvents: [
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
        title: '클라이언트 미팅',
        date: '2025-11-08',
        startTime: '13:30',
        endTime: '14:30',
        location: '온라인',
        description: '신규 프로젝트 논의',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 30,
      },
    ],
  },
};

export const ManyOverlappingEvents: Story = {
  args: {
    open: true,
    overlappingEvents: [
      {
        id: '1',
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
        id: '2',
        title: '팀 미팅',
        date: '2025-11-08',
        startTime: '09:15',
        endTime: '10:00',
        location: '회의실 A',
        description: '프로젝트 진행 상황 공유',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 10,
      },
      {
        id: '3',
        title: '코드 리뷰',
        date: '2025-11-08',
        startTime: '09:30',
        endTime: '10:30',
        location: '온라인',
        description: '프론트엔드 코드 품질 점검',
        repeat: { type: 'none', interval: 0 },
        category: '개발',
        notificationTime: 5,
      },
      {
        id: '4',
        title: '클라이언트 프레젠테이션',
        date: '2025-11-08',
        startTime: '09:00',
        endTime: '10:00',
        location: '클라이언트 사무실',
        description: '분기 성과 보고',
        repeat: { type: 'none', interval: 0 },
        category: '업무',
        notificationTime: 120,
      },
    ],
  },
};

