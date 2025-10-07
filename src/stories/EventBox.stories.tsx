import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { fn } from 'storybook/test';

import EventBox from '../components/EventBox';
import { Event } from '../types';

const mockEvent: Event = {
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
};

const mockRepeatingEvent: Event = {
  ...mockEvent,
  id: '2',
  title: '주간 스탠드업',
  repeat: {
    type: 'weekly',
    interval: 1,
    endDate: '2024-06-15',
  },
};

const mockLongTitleEvent: Event = {
  ...mockEvent,
  id: '3',
  title: '매우 긴 제목을 가진 중요한 프로젝트 관련 회의 및 논의사항 검토 미팅입니다',
};

// Storybook용 DragDropContext 래퍼
const DragDropWrapper = ({ children }: { children: ReactNode }) => (
  <DragDropContext onDragEnd={() => {}}>
    <Droppable droppableId="story-droppable">
      {(provided) => (
        <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          sx={{
            width: 200,
            minHeight: 100,
            border: '1px dashed #ccc',
            borderRadius: 1,
            p: 2,
            backgroundColor: '#fafafa',
          }}
        >
          {children}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  </DragDropContext>
);

const meta: Meta<typeof EventBox> = {
  title: 'Components/EventBox',
  component: EventBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '캘린더에서 사용되는 드래그 가능한 일정 박스 컴포넌트입니다. 알림 상태, 반복 일정, 텍스트 오버플로우를 처리합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <DragDropWrapper>
        <Story />
      </DragDropWrapper>
    ),
  ],
  argTypes: {
    event: {
      description: '일정 정보 객체',
    },
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: '드래그 앤 드롭을 위한 인덱스',
    },
    isNotified: {
      control: { type: 'boolean' },
      description: '알림 상태 여부',
    },
    variant: {
      control: { type: 'radio' },
      options: ['week', 'month'],
      description: '캘린더 뷰 타입 (스타일 변형)',
    },
    onClick: {
      description: '클릭 이벤트 핸들러',
      action: 'clicked',
    },
  },
  args: {
    event: mockEvent,
    index: 0,
    isNotified: false,
    variant: 'week',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    isNotified: false,
  },
  parameters: {
    docs: {
      description: {
        story: '일반 상태의 일정 박스입니다. 기본적인 일정 정보만 표시됩니다.',
      },
    },
  },
};

export const Notified: Story = {
  args: {
    isNotified: true,
  },
  parameters: {
    docs: {
      description: {
        story: '알림이 설정된 일정 박스입니다. 빨간색 배경과 알림 아이콘이 표시됩니다.',
      },
    },
  },
};

export const RepeatingEvent: Story = {
  args: {
    event: mockRepeatingEvent,
    isNotified: false,
  },
  parameters: {
    docs: {
      description: {
        story: '반복 일정 박스입니다. 반복 아이콘과 툴팁으로 반복 정보를 확인할 수 있습니다.',
      },
    },
  },
};

export const NotifiedRepeatingEvent: Story = {
  args: {
    event: mockRepeatingEvent,
    isNotified: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '알림과 반복이 모두 설정된 일정 박스입니다. 알림 아이콘과 반복 아이콘이 함께 표시됩니다.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    event: mockLongTitleEvent,
    isNotified: false,
  },
  parameters: {
    docs: {
      description: {
        story: '긴 제목을 가진 일정 박스입니다. 텍스트가 넘치면 말줄임표(...)로 처리됩니다.',
      },
    },
  },
};

export const LongTitleNotified: Story = {
  args: {
    event: mockLongTitleEvent,
    isNotified: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '긴 제목과 알림이 설정된 일정 박스입니다. 아이콘과 텍스트의 레이아웃을 확인할 수 있습니다.',
      },
    },
  },
};

export const WeekViewVariant: Story = {
  args: {
    event: mockRepeatingEvent,
    isNotified: true,
    variant: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: 'Week View용 스타일 변형입니다. eventBoxStyles를 사용한 통일된 스타일이 적용됩니다.',
      },
    },
  },
};

export const MonthViewVariant: Story = {
  args: {
    event: mockRepeatingEvent,
    isNotified: true,
    variant: 'month',
  },
  parameters: {
    docs: {
      description: {
        story: 'Month View용 스타일 변형입니다. 인라인 스타일을 사용한 레거시 스타일이 적용됩니다.',
      },
    },
  },
};

export const DailyRepeating: Story = {
  args: {
    event: {
      ...mockEvent,
      id: '4',
      title: '운동',
      repeat: {
        type: 'daily',
        interval: 1,
      },
    },
    isNotified: false,
  },
  parameters: {
    docs: {
      description: {
        story: '매일 반복되는 일정입니다. 툴팁에서 "1일마다 반복" 정보를 확인할 수 있습니다.',
      },
    },
  },
};

export const MonthlyRepeating: Story = {
  args: {
    event: {
      ...mockEvent,
      id: '5',
      title: '월례 회의',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: true,
  },
  parameters: {
    docs: {
      description: {
        story: '월별 반복 일정입니다. 반복 종료일이 설정되어 툴팁에 종료 정보가 표시됩니다.',
      },
    },
  },
};
