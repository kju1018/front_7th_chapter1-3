import { useDroppable } from '@dnd-kit/core';
import { TableCell, Typography } from '@mui/material';

import { DraggableEvent } from './DraggableEvent';
import { Event, RepeatType } from '../types';

export function DroppableTableCell({
  day,
  holiday,
  dateString,
  filteredEventsForDay,
  notifiedEvents,
  getRepeatTypeLabel,
  onCellClick,
}: {
  day: number | null;
  holiday: string;
  dateString: string;
  filteredEventsForDay: Event[];
  notifiedEvents: string[];
  getRepeatTypeLabel: (type: RepeatType) => string;
  onCellClick?: (date: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: dateString || `empty-${Math.random()}`,
    data: { date: dateString },
  });

  const handleCellClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
    // 이벤트 박스를 클릭한 경우가 아니라면 (빈 공간 클릭)
    if (onCellClick && dateString && e.target === e.currentTarget) {
      onCellClick(dateString);
    }
  };

  return (
    <TableCell
      ref={setNodeRef}
      onClick={handleCellClick}
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
        cursor: day ? 'pointer' : 'default',
      }}
    >
      {day && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {day}
          </Typography>
          {holiday && (
            <Typography
              variant="body2"
              color="error"
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {holiday}
            </Typography>
          )}
          {filteredEventsForDay.map((event: Event) => {
            const isNotified = notifiedEvents.includes(event.id);
            const isRepeating = event.repeat.type !== 'none';

            return (
              <DraggableEvent
                key={event.id}
                event={event}
                isNotified={isNotified}
                isRepeating={isRepeating}
                getRepeatTypeLabel={getRepeatTypeLabel}
              />
            );
          })}
        </>
      )}
    </TableCell>
  );
}
