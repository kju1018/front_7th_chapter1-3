import { Draggable, DraggableProvided } from '@hello-pangea/dnd';
import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { MouseEvent } from 'react';

import { Event, RepeatType } from '../types';

const eventBoxStyles = {
  notified: {
    backgroundColor: '#ffebee',
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  normal: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'normal',
    color: 'inherit',
  },
  common: {
    p: 0.5,
    my: 0.5,
    borderRadius: 1,
    minHeight: '18px',
    width: '100%',
    overflow: 'hidden',
  },
};

const getRepeatTypeLabel = (type: RepeatType): string => {
  switch (type) {
    case 'daily':
      return '일';
    case 'weekly':
      return '주';
    case 'monthly':
      return '월';
    case 'yearly':
      return '년';
    default:
      return '';
  }
};

export interface EventBoxProps {
  event: Event;
  index: number;
  isNotified: boolean;
  variant?: 'week' | 'month';
  onClick?: (event: MouseEvent) => void;
}

export default function EventBox({
  event,
  index,
  isNotified,
  variant = 'week',
  onClick,
}: EventBoxProps) {
  const isRepeating = event.repeat.type !== 'none';

  // 스타일 계산 - WeekView는 eventBoxStyles 사용, MonthView는 인라인 스타일 사용
  const boxStyles =
    variant === 'week'
      ? {
          ...eventBoxStyles.common,
          ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
        }
      : {
          p: 0.5,
          my: 0.5,
          backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
          borderRadius: 1,
          fontWeight: isNotified ? 'bold' : 'normal',
          color: isNotified ? '#d32f2f' : 'inherit',
          minHeight: '18px',
          width: '100%',
          overflow: 'hidden',
        };

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided: DraggableProvided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          sx={boxStyles}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {isNotified && <Notifications fontSize="small" />}
            {isRepeating && (
              <Tooltip
                title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                  event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                }`}
              >
                <Repeat fontSize="small" />
              </Tooltip>
            )}
            <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              {event.title}
            </Typography>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
