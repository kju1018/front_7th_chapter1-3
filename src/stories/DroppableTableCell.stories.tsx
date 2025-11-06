import type { Meta, StoryObj } from '@storybook/react-vite';
import { DndContext } from '@dnd-kit/core';
import { fn } from 'storybook/test';
import { DroppableTableCell } from '../components/DroppableTableCell';
import type { Event, RepeatType } from '../types';
import { Table, TableBody, TableRow } from '@mui/material';

const meta: Meta<typeof DroppableTableCell> = {
  title: 'Calendar/DroppableTableCell',
  component: DroppableTableCell,
  decorators: [
    (Story) => (
      <DndContext>
        <Table sx={{ width: '100%', maxWidth: '100px', tableLayout: 'fixed' }}>
          <TableBody>
            <TableRow>
              <Story />
            </TableRow>
          </TableBody>
        </Table>
      </DndContext>
    ),
  ],
  args: {
    day: 15,
    holiday: '',
    dateString: '2025-11-15',
    filteredEventsForDay: [] as Event[],
    notifiedEvents: [],
    getRepeatTypeLabel: (type: RepeatType) => {
      const labels: Record<RepeatType, string> = {
        none: '',
        daily: '일',
        weekly: '주',
        monthly: '월',
        yearly: '년',
      };
      return labels[type];
    },
    onCellClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DroppableTableCell>;

// 기본 빈 셀
export const EmptyCell: Story = {
  args: {
    day: 15,
    holiday: '',
    filteredEventsForDay: [],
  },
};

// 공휴일이 짧은 경우
export const ShortHoliday: Story = {
  args: {
    day: 1,
    holiday: '신정',
    filteredEventsForDay: [],
  },
};

// 공휴일 이름이 긴 경우 (ellipsis 처리 필요)
export const LongHoliday: Story = {
  args: {
    day: 15,
    holiday: '광복절 및 대체공휴일 지정',
    filteredEventsForDay: [],
  },
};

// 이벤트 제목이 매우 긴 경우 (ellipsis 처리 필수)
export const VeryLongEventTitle: Story = {
  args: {
    day: 20,
    holiday: '',
    filteredEventsForDay: [
      {
        id: '1',
        title: '2025년 상반기 전사 워크샵 및 팀 빌딩 행사 그리고 신규 사업 계획 발표회',
        date: '2025-11-20',
        startTime: '09:00',
        endTime: '18:00',
        description: '장기 이벤트',
        location: '제주도',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
    ],
  },
};

// 여러 개의 긴 제목 이벤트 (각각 ellipsis 처리)
export const MultipleLongTitles: Story = {
  args: {
    day: 25,
    holiday: '',
    filteredEventsForDay: [
      {
        id: '1',
        title: '클라이언트 미팅 - 신규 프로젝트 기획안 검토 및 요구사항 분석 회의',
        date: '2025-11-25',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '개발팀 스프린트 회고 및 다음 스프린트 계획 수립 미팅',
        date: '2025-11-25',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '온라인',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: 'UI/UX 디자인 시스템 개선 및 브랜드 아이덴티티 재정립 워크샵',
        date: '2025-11-25',
        startTime: '16:00',
        endTime: '17:30',
        description: '',
        location: '본사',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
      },
    ],
  },
};

// 긴 공휴일 + 긴 이벤트 제목 조합 (최악의 시나리오)
export const LongHolidayAndLongEvents: Story = {
  args: {
    day: 3,
    holiday: '개천절 대체공휴일',
    filteredEventsForDay: [
      {
        id: '1',
        title: '전국 단위 문화 행사 및 지역 축제 참여 이벤트 안내',
        date: '2025-11-03',
        startTime: '10:00',
        endTime: '12:00',
        description: '',
        location: '광화문 광장',
        category: '기타',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
      {
        id: '2',
        title: '가족과 함께하는 야외 나들이 및 피크닉 일정 계획',
        date: '2025-11-03',
        startTime: '13:00',
        endTime: '17:00',
        description: '',
        location: '한강공원',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 120,
      },
    ],
  },
};

// 반복 일정 아이콘 + 긴 제목 (ellipsis 처리 확인)
export const RepeatingEventWithLongTitle: Story = {
  args: {
    day: 10,
    holiday: '',
    filteredEventsForDay: [
      {
        id: '1',
        title: '매주 월요일 오전 전체 팀 미팅 및 주간 업무 계획 공유 시간',
        date: '2025-11-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '주간 반복',
        location: '온라인',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-12-31',
        },
        notificationTime: 10,
      },
    ],
  },
};

// 알림 아이콘 + 긴 제목 (ellipsis 처리 확인)
export const NotifiedEventWithLongTitle: Story = {
  args: {
    day: 12,
    holiday: '',
    filteredEventsForDay: [
      {
        id: '1',
        title: '중요한 프레젠테이션 발표 준비 및 최종 리허설 시간 확보 필수',
        date: '2025-11-12',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '대회의실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
      },
    ],
    notifiedEvents: ['1'],
  },
};

// 반복 + 알림 아이콘 모두 + 긴 제목 (아이콘이 많아 텍스트 공간이 더 작음)
export const NotifiedRepeatingEventWithLongTitle: Story = {
  args: {
    day: 18,
    holiday: '',
    filteredEventsForDay: [
      {
        id: '1',
        title: '매일 아침 진행되는 건강 체크업 및 웰니스 프로그램 참여 일정',
        date: '2025-11-18',
        startTime: '07:00',
        endTime: '08:00',
        description: '',
        location: '헬스장',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-12-31',
        },
        notificationTime: 30,
      },
    ],
    notifiedEvents: ['1'],
  },
};

// 최대 용량 테스트 - 많은 이벤트 + 긴 제목들
export const OverflowingCell: Story = {
  args: {
    day: 28,
    holiday: '크리스마스',
    filteredEventsForDay: [
      {
        id: '1',
        title: '아침 일찍 시작하는 연말 결산 회의 및 내년도 사업 계획 수립',
        date: '2025-11-28',
        startTime: '08:00',
        endTime: '09:00',
        description: '',
        location: '본사',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
      {
        id: '2',
        title: '고객사 방문 미팅 - 연간 계약 갱신 및 서비스 개선 논의',
        date: '2025-11-28',
        startTime: '10:00',
        endTime: '11:30',
        description: '',
        location: '고객사',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
      },
      {
        id: '3',
        title: '점심 식사 후 진행되는 팀 빌딩 활동 및 송년회 준비 회의',
        date: '2025-11-28',
        startTime: '13:00',
        endTime: '14:00',
        description: '',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '오후 업무 마무리 및 주간 보고서 작성 시간 할애',
        date: '2025-11-28',
        startTime: '15:00',
        endTime: '16:00',
        description: '',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '5',
        title: '저녁 회식 - 올해 한 해 고생한 팀원들과 함께하는 감사 파티',
        date: '2025-11-28',
        startTime: '18:00',
        endTime: '21:00',
        description: '',
        location: '강남역 인근 식당',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 120,
      },
    ],
    notifiedEvents: ['1', '5'],
  },
};
