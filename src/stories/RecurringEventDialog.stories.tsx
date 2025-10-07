import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RecurringEventDialog from '../components/RecurringEventDialog';
import { Event } from '../types';

const mockRecurringEvent: Event = {
  id: '1',
  title: '주간 스탠드업 회의',
  date: '2024-01-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '팀 주간 스탠드업',
  location: '회의실 A',
  category: '업무',
  repeat: {
    type: 'weekly',
    interval: 1,
    endDate: '2024-06-15',
  },
  notificationTime: 10,
};

const meta: Meta<typeof RecurringEventDialog> = {
  title: 'Components/RecurringEventDialog',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '반복 일정의 수정/삭제 시 단일 인스턴스 또는 전체 시리즈 중 선택할 수 있는 다이얼로그 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: '다이얼로그 열림 상태',
    },
    mode: {
      control: { type: 'radio' },
      options: ['edit', 'delete'],
      description: '다이얼로그 모드 (수정/삭제)',
    },
    event: {
      description: '반복 일정 이벤트 객체',
    },
    onConfirm: {
      description: '확인 버튼 클릭 콜백 (editSingleOnly: boolean)',
      action: 'confirmed',
    },
  },
  args: {
    open: true,
    mode: 'edit',
    event: mockRecurringEvent,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EditMode: Story = {
  args: {
    mode: 'edit',
    event: mockRecurringEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '반복 일정 수정 모드입니다. "해당 일정만 수정하시겠어요?" 메시지를 표시합니다.',
      },
    },
  },
};

export const DeleteMode: Story = {
  args: {
    mode: 'delete',
    event: mockRecurringEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '반복 일정 삭제 모드입니다. "해당 일정만 삭제하시겠어요?" 메시지를 표시합니다.',
      },
    },
  },
};
