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
