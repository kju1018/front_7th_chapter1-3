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
}: {
  day: number | null;
  holiday: string;
  dateString: string;
  filteredEventsForDay: Event[];
  notifiedEvents: string[];
  getRepeatTypeLabel: (type: RepeatType) => string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: dateString || `empty-${Math.random()}`,
    data: { date: dateString },
  });

  return (
    <TableCell
      ref={setNodeRef}
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
      }}
    >
      {day && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {day}
          </Typography>
          {holiday && (
            <Typography variant="body2" color="error">
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
