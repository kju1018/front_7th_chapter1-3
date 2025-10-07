import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import EventForm from '../components/EventForm';

const meta: Meta<typeof EventForm> = {
  title: 'Components/EventForm',
  component: EventForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '일정 생성 및 수정을 위한 폼 컴포넌트입니다. 반복 일정 설정과 유효성 검사를 지원합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400, maxHeight: '80vh', overflow: 'auto', p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: '일정 제목',
    },
    date: {
      control: { type: 'date' },
      description: '일정 날짜',
    },
    startTime: {
      control: { type: 'text' },
      description: '시작 시간 (HH:MM)',
    },
    endTime: {
      control: { type: 'text' },
      description: '종료 시간 (HH:MM)',
    },
    description: {
      control: { type: 'text' },
      description: '일정 설명',
    },
    location: {
      control: { type: 'text' },
      description: '장소',
    },
    category: {
      control: { type: 'select' },
      options: ['업무', '개인', '가족', '기타'],
      description: '카테고리',
    },
    isRepeating: {
      control: { type: 'boolean' },
      description: '반복 일정 여부',
    },
    repeatType: {
      control: { type: 'radio' },
      options: ['daily', 'weekly', 'monthly', 'yearly'],
      description: '반복 유형',
    },
    repeatInterval: {
      control: { type: 'number', min: 1, max: 12 },
      description: '반복 간격',
    },
    repeatEndDate: {
      control: { type: 'date' },
      description: '반복 종료일',
    },
    notificationTime: {
      control: { type: 'select' },
      options: [1, 10, 60, 120, 1440],
      description: '알림 시간 (분)',
    },
    isEditing: {
      control: { type: 'boolean' },
      description: '편집 모드 여부',
    },
    startTimeError: {
      control: { type: 'text' },
      description: '시작 시간 오류 메시지',
    },
    endTimeError: {
      control: { type: 'text' },
      description: '종료 시간 오류 메시지',
    },
    onSubmit: {
      description: '제출 버튼 클릭 콜백',
      action: 'submitted',
    },
  },
  args: {
    title: '',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '업무',
    isRepeating: false,
    repeatType: 'daily',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 10,
    isEditing: false,
    onTitleChange: fn(),
    onDateChange: fn(),
    onStartTimeChange: fn(),
    onEndTimeChange: fn(),
    onDescriptionChange: fn(),
    onLocationChange: fn(),
    onCategoryChange: fn(),
    onIsRepeatingChange: fn(),
    onRepeatTypeChange: fn(),
    onRepeatIntervalChange: fn(),
    onRepeatEndDateChange: fn(),
    onNotificationTimeChange: fn(),
    onSubmit: fn(),
    onTimeBlur: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutRecurring: Story = {
  args: {
    isRepeating: false,
    title: '프로젝트 회의',
    description: '프로젝트 진행 상황 논의',
    location: '회의실 A',
  },
  parameters: {
    docs: {
      description: {
        story:
          '반복 일정이 비활성화된 기본 폼입니다. 반복 일정 체크박스가 체크되지 않은 상태로, 반복 설정 필드들이 숨겨져 있습니다.',
      },
    },
  },
};

export const WithRecurring: Story = {
  args: {
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 1,
    repeatEndDate: '2024-06-15',
    title: '주간 스탠드업',
    description: '팀 주간 스탠드업 미팅',
    location: '회의실 B',
  },
  parameters: {
    docs: {
      description: {
        story:
          '반복 일정이 활성화된 폼입니다. 반복 일정 체크박스가 체크되어 있고, 반복 유형, 간격, 종료일 설정 필드들이 표시됩니다.',
      },
    },
  },
};

export const EditingMode: Story = {
  args: {
    isEditing: true,
    title: '기존 일정',
    description: '수정 중인 일정',
    location: '온라인',
    category: '개인',
  },
  parameters: {
    docs: {
      description: {
        story:
          '편집 모드의 폼입니다. 제목이 "일정 수정"으로 변경되고, 반복 일정 체크박스가 숨겨집니다.',
      },
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    title: '시간 오류 테스트',
    startTime: '14:00',
    endTime: '12:00',
    startTimeError: '시작 시간이 종료 시간보다 늦습니다',
    endTimeError: '종료 시간이 시작 시간보다 빠릅니다',
  },
  parameters: {
    docs: {
      description: {
        story:
          '시간 유효성 검사 오류가 있는 폼입니다. 시작/종료 시간 필드에 오류 메시지와 빨간 테두리가 표시됩니다.',
      },
    },
  },
};

export const DailyRecurring: Story = {
  args: {
    isRepeating: true,
    repeatType: 'daily',
    repeatInterval: 1,
    title: '매일 운동',
    description: '헬스장 운동',
    location: '헬스장',
    category: '개인',
    startTime: '19:00',
    endTime: '20:30',
    notificationTime: 120,
  },
  parameters: {
    docs: {
      description: {
        story: '매일 반복되는 일정 설정 예시입니다.',
      },
    },
  },
};

export const MonthlyRecurring: Story = {
  args: {
    isRepeating: true,
    repeatType: 'monthly',
    repeatInterval: 1,
    repeatEndDate: '2024-12-31',
    title: '월례 보고서 작성',
    description: '월별 성과 보고서 작성 및 제출',
    location: '사무실',
    category: '업무',
    notificationTime: 1440,
  },
  parameters: {
    docs: {
      description: {
        story: '월별 반복 일정 설정 예시입니다. 종료일이 설정되어 있습니다.',
      },
    },
  },
};
