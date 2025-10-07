import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FC, MouseEvent } from 'react';

import EventBox from './EventBox';
import { Event } from '../types';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
} from '../utils/dateUtils';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export interface CalendarViewProps {
  view: 'week' | 'month';
  currentDate: Date;
  events: Event[];
  notifiedEvents: string[];
  holidays: Record<string, string>;
  onDragEnd: OnDragEndResponder<string>;
  onCellClick: (dateString: string, event: MouseEvent) => void;
}

const WeekView: FC<CalendarViewProps> = (props) => {
  const { currentDate, events, notifiedEvents, onDragEnd, onCellClick } = props;
  const weekDates = getWeekDates(currentDate);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
        <TableContainer>
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
                {weekDates.map((date) => (
                  <Droppable droppableId={formatDate(date)} key={date.toISOString()}>
                    {(provided) => (
                      <TableCell
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        onClick={(e: MouseEvent) => onCellClick(formatDate(date), e)}
                        sx={{
                          height: '120px',
                          verticalAlign: 'top',
                          width: '14.28%',
                          padding: 1,
                          border: '1px solid #e0e0e0',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#dcdfdd',
                          },
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {date.getDate()}
                        </Typography>
                        {events
                          .filter(
                            (event) => new Date(event.date).toDateString() === date.toDateString()
                          )
                          .map((event, index) => {
                            const isNotified = notifiedEvents.includes(event.id);

                            return (
                              <EventBox
                                key={event.id}
                                event={event}
                                index={index}
                                isNotified={isNotified}
                                variant="week"
                              />
                            );
                          })}
                      </TableCell>
                    )}
                  </Droppable>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DragDropContext>
  );
};

const MonthView: FC<CalendarViewProps> = (props) => {
  const { currentDate, events, notifiedEvents, onDragEnd, onCellClick, holidays } = props;
  const weeks = getWeeksAtMonth(currentDate);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
        <TableContainer>
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
                    const dateString = day
                      ? formatDate(currentDate, day)
                      : (-1 * dayIndex).toString();
                    const holiday = holidays[dateString];

                    return (
                      <Droppable droppableId={dateString} key={dateString}>
                        {(provided) => (
                          <TableCell
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            onClick={(e: MouseEvent) => day && onCellClick(dateString, e)}
                            sx={{
                              height: '120px',
                              verticalAlign: 'top',
                              width: '14.28%',
                              padding: 1,
                              border: '1px solid #e0e0e0',
                              overflow: 'hidden',
                              position: 'relative',
                              cursor: day ? 'pointer' : 'default',
                              '&:hover': day
                                ? {
                                    backgroundColor: '#dcdfdd',
                                  }
                                : {},
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
                                {getEventsForDay(events, day).map((event, index) => {
                                  const isNotified = notifiedEvents.includes(event.id);

                                  return (
                                    <EventBox
                                      key={event.id}
                                      event={event}
                                      index={index}
                                      isNotified={isNotified}
                                      variant="month"
                                    />
                                  );
                                })}
                              </>
                            )}
                          </TableCell>
                        )}
                      </Droppable>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DragDropContext>
  );
};

export default function CalendarView(props: CalendarViewProps) {
  const { view } = props;

  return (
    <>
      {view === 'week' && <WeekView {...props} />}
      {view === 'month' && <MonthView {...props} />}
    </>
  );
}
