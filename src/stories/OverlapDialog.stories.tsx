import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import OverlapDialog from '../components/OverlapDialog';
import { Event } from '../types';

const mockOverlappingEvents: Event[] = [
  {
    id: '1',
    title: '프로젝트 회의',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '12:00',
    description: '프로젝트 진행 상황 논의',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2024-01-15',
    startTime: '11:30',
    endTime: '13:00',
    description: '동료와 점심',
    location: '레스토랑',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

const singleOverlappingEvent: Event[] = [
  {
    id: '3',
    title: '매우 긴 제목을 가진 중요한 프로젝트 관련 회의 및 논의사항 검토 미팅입니다',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '16:00',
    description: '긴 제목 테스트',
    location: '온라인',
    category: '업무',
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 60,
  },
];

const manyOverlappingEvents: Event[] = [
  ...mockOverlappingEvents,
  {
    id: '4',
    title: '운동',
    date: '2024-01-15',
    startTime: '11:00',
    endTime: '12:30',
    description: '헬스장 운동',
    location: '헬스장',
    category: '개인',
    repeat: { type: 'daily', interval: 1 },
    notificationTime: 120,
  },
  {
    id: '5',
    title: '병원 진료',
    date: '2024-01-15',
    startTime: '10:30',
    endTime: '11:30',
    description: '정기 검진',
    location: '병원',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1440,
  },
  {
    id: '6',
    title: '온라인 회의',
    date: '2024-01-15',
    startTime: '11:45',
    endTime: '12:15',
    description: '팀 스탠드업',
    location: '온라인',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

const meta: Meta<typeof OverlapDialog> = {
  title: 'Components/OverlapDialog',
  component: OverlapDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '일정 겹침 경고를 표시하는 다이얼로그 컴포넌트입니다. 겹치는 일정 목록을 보여주고 사용자의 확인을 요청합니다.',
      },
    },
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: '다이얼로그 열림 상태',
    },
    overlappingEvents: {
      description: '겹치는 일정 목록',
    },
    onConfirm: {
      description: '계속 진행 확인 콜백',
      action: 'confirmed',
    },
  },
  args: {
    open: true,
    overlappingEvents: mockOverlappingEvents,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    overlappingEvents: mockOverlappingEvents,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 일정 겹침 다이얼로그입니다. 2개의 겹치는 일정을 표시합니다.',
      },
    },
  },
};

export const SingleOverlap: Story = {
  args: {
    overlappingEvents: singleOverlappingEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '하나의 일정과 겹치는 경우입니다. 긴 제목의 일정을 포함합니다.',
      },
    },
  },
};

export const MultipleOverlaps: Story = {
  args: {
    overlappingEvents: manyOverlappingEvents,
  },
  parameters: {
    docs: {
      description: {
        story: '여러 일정과 겹치는 경우입니다. 5개의 겹치는 일정을 표시합니다.',
      },
    },
  },
};

export const LongEventTitles: Story = {
  args: {
    overlappingEvents: [
      {
        id: '7',
        title:
          '매우 매우 긴 제목을 가진 일정으로 텍스트 오버플로우를 테스트하기 위한 매우 긴 제목입니다',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '긴 제목 테스트',
        location: '회의실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '8',
        title: '또 다른 매우 긴 제목을 가진 일정입니다. 이것도 텍스트 오버플로우 테스트용입니다.',
        date: '2024-01-15',
        startTime: '09:30',
        endTime: '11:00',
        description: '긴 제목 테스트 2',
        location: '온라인 회의실',
        category: '업무',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 30,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '매우 긴 제목을 가진 일정들과의 겹침입니다. 텍스트 표시 방식을 확인할 수 있습니다.',
      },
    },
  },
};
