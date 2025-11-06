import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Notifications from '@mui/icons-material/Notifications';
import Repeat from '@mui/icons-material/Repeat';
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { Event, RepeatType } from '../types.ts';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
} from '../utils/dateUtils.ts';
import { DroppableTableCell } from './DroppableTableCell.tsx';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

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

interface CalendarViewProps {
  view: 'week' | 'month';
  setView: (view: 'week' | 'month') => void;
  currentDate: Date;
  holidays: Record<string, string>;
  navigate: (direction: 'prev' | 'next') => void;
  filteredEvents: Event[];
  notifiedEvents: string[];
  handleCellClick: (date: string) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  activeEvent: Event | null;
}

export function CalendarView({
  view,
  setView,
  currentDate,
  holidays,
  navigate,
  filteredEvents,
  notifiedEvents,
  handleCellClick,
  handleDragStart,
  handleDragEnd,
  activeEvent,
}: CalendarViewProps) {
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    return (
      <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
        <TableContainer>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  {weekDays.map((day) => (
                    <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {weekDates.map((date) => {
                    const dateString = formatDate(date);
                    const filteredEventsForDay = filteredEvents.filter(
                      (event) => new Date(event.date).toDateString() === date.toDateString()
                    );

                    return (
                      <DroppableTableCell
                        key={date.toISOString()}
                        day={date.getDate()}
                        holiday=""
                        dateString={dateString}
                        filteredEventsForDay={filteredEventsForDay}
                        notifiedEvents={notifiedEvents}
                        getRepeatTypeLabel={getRepeatTypeLabel}
                        onCellClick={handleCellClick}
                      />
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
            <DragOverlay>
              {activeEvent ? (
                <Box
                  sx={{
                    p: 0.5,
                    backgroundColor: notifiedEvents.includes(activeEvent.id)
                      ? '#ffebee'
                      : '#f5f5f5',
                    borderRadius: 1,
                    fontWeight: notifiedEvents.includes(activeEvent.id) ? 'bold' : 'normal',
                    color: notifiedEvents.includes(activeEvent.id) ? '#d32f2f' : 'inherit',
                    minHeight: '18px',
                    width: '60px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    cursor: 'grabbing',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {notifiedEvents.includes(activeEvent.id) && <Notifications fontSize="small" />}
                    {activeEvent.repeat.type !== 'none' && (
                      <Tooltip
                        title={`${activeEvent.repeat.interval}${getRepeatTypeLabel(
                          activeEvent.repeat.type
                        )}마다 반복${
                          activeEvent.repeat.endDate ? ` (종료: ${activeEvent.repeat.endDate})` : ''
                        }`}
                      >
                        <Repeat fontSize="small" />
                      </Tooltip>
                    )}
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                    >
                      {activeEvent.title}
                    </Typography>
                  </Stack>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TableContainer>
      </Stack>
    );
  };

  const renderMonthView = () => {
    const weeks = getWeeksAtMonth(currentDate);

    return (
      <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
        <TableContainer>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  {weekDays.map((day) => (
                    <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {weeks.map((week, weekIndex) => (
                  <TableRow key={weekIndex}>
                    {week.map((day, dayIndex) => {
                      const dateString = day ? formatDate(currentDate, day) : '';
                      const holiday = holidays[dateString];
                      const filteredEventsForDay: Event[] = day
                        ? getEventsForDay(filteredEvents, day)
                        : [];

                      return (
                        <DroppableTableCell
                          key={dayIndex}
                          day={day}
                          holiday={holiday}
                          dateString={dateString}
                          filteredEventsForDay={filteredEventsForDay}
                          notifiedEvents={notifiedEvents}
                          getRepeatTypeLabel={getRepeatTypeLabel}
                          onCellClick={handleCellClick}
                        />
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DragOverlay>
              {activeEvent ? (
                <Box
                  data-testid="drag-overlay"
                  sx={{
                    p: 0.5,
                    backgroundColor: notifiedEvents.includes(activeEvent.id)
                      ? '#ffebee'
                      : '#f5f5f5',
                    borderRadius: 1,
                    fontWeight: notifiedEvents.includes(activeEvent.id) ? 'bold' : 'normal',
                    color: notifiedEvents.includes(activeEvent.id) ? '#d32f2f' : 'inherit',
                    minHeight: '18px',
                    width: '60px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    cursor: 'grabbing',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {notifiedEvents.includes(activeEvent.id) && <Notifications fontSize="small" />}
                    {activeEvent.repeat.type !== 'none' && (
                      <Tooltip
                        title={`${activeEvent.repeat.interval}${getRepeatTypeLabel(
                          activeEvent.repeat.type
                        )}마다 반복${
                          activeEvent.repeat.endDate ? ` (종료: ${activeEvent.repeat.endDate})` : ''
                        }`}
                      >
                        <Repeat fontSize="small" />
                      </Tooltip>
                    )}
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                    >
                      {activeEvent.title}
                    </Typography>
                  </Stack>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TableContainer>
      </Stack>
    );
  };

  return (
    <Stack flex={1} spacing={5}>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>

      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </Stack>
  );
}
