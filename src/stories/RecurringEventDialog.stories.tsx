import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import RecurringEventDialog from '../components/RecurringEventDialog';

const meta: Meta<typeof RecurringEventDialog> = {
  title: 'Dialogs/RecurringEventDialog',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: false,
    onClose: fn(),
    onConfirm: fn(),
    event: null,
    mode: 'edit',
  },
};

export default meta;
type Story = StoryObj<typeof RecurringEventDialog>;

/**
 * ✅ 반복 일정 수정 다이얼로그 (열린 상태)
 * - "해당 일정만 수정하시겠어요?" 메시지 표시
 * - 예/아니오/취소 버튼
 */
export const EditMode: Story = {
  args: {
    open: true,
    mode: 'edit',
    event: {
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
  },
};

/**
 * ✅ 반복 일정 삭제 다이얼로그 (열린 상태)
 * - "해당 일정만 삭제하시겠어요?" 메시지 표시
 * - 예/아니오/취소 버튼
 */
export const DeleteMode: Story = {
  args: {
    open: true,
    mode: 'delete',
    event: {
      id: '2',
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
  },
};

