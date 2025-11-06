import type { Meta, StoryObj } from '@storybook/react-vite';

import { NotificationAlert } from '../components/NotificationAlert';

const meta: Meta<typeof NotificationAlert> = {
  title: 'Notifications/NotificationAlert',
  component: NotificationAlert,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    notifications: [],
    onRemoveNotification: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof NotificationAlert>;

export const Empty: Story = {
  args: {
    notifications: [],
  },
};

export const SingleUpcomingNotification: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '10분 후 팀 미팅 일정이 시작됩니다.',
      },
    ],
  },
};

export const MultipleUpcomingNotifications: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '5분 후 팀 스탠드업 일정이 시작됩니다.',
      },
      {
        id: '2',
        message: '15분 후 프로젝트 회의 일정이 시작됩니다.',
      },
      {
        id: '3',
        message: '30분 후 1:1 면담 일정이 시작됩니다.',
      },
    ],
  },
};