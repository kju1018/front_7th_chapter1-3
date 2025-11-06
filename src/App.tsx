import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { CalendarView } from './components/CalendarView.tsx';
import { EventEditor } from './components/EventEditor.tsx';
import { EventList } from './components/EventList.tsx';
import { NotificationAlert } from './components/NotificationAlert.tsx';
import RecurringEventDialog from './components/RecurringEventDialog.tsx';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useRecurringEventOperations } from './hooks/useRecurringEventOperations.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm } from './types.ts';
import { findOverlappingEvents } from './utils/eventOverlap.ts';
import { getUpdatedEventAfterDrag } from './utils/dragUtils.ts';


function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const {
    events,
    saveEvent,
    deleteEvent,
    createRepeatEvent,
    fetchEvents,
    updateEventOptimistically,
  } = useEventOperations(Boolean(editingEvent), () => setEditingEvent(null));

  const { handleRecurringEdit, handleRecurringDelete } = useRecurringEventOperations(
    events,
    async () => {
      // After recurring edit, refresh events from server
      await fetchEvents();
    }
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [pendingRecurringEdit, setPendingRecurringEdit] = useState<Event | null>(null);
  const [pendingRecurringDelete, setPendingRecurringDelete] = useState<Event | null>(null);
  const [recurringEditMode, setRecurringEditMode] = useState<boolean | null>(null); // true = single, false = all
  const [recurringDialogMode, setRecurringDialogMode] = useState<'edit' | 'delete'>('edit');
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [pendingDraggedEvent, setPendingDraggedEvent] = useState<Event | null>(null);
  const [originalDraggedEvent, setOriginalDraggedEvent] = useState<Event | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleRecurringConfirm = async (editSingleOnly: boolean) => {
    if (recurringDialogMode === 'edit' && pendingRecurringEdit) {
      // 편집 모드 저장하고 편집 폼으로 이동
      setRecurringEditMode(editSingleOnly);
      editEvent(pendingRecurringEdit);
      setIsRecurringDialogOpen(false);
      setPendingRecurringEdit(null);
    } else if (recurringDialogMode === 'delete' && pendingRecurringDelete) {
      // 반복 일정 삭제 처리
      try {
        await handleRecurringDelete(pendingRecurringDelete, editSingleOnly);
        enqueueSnackbar('일정이 삭제되었습니다', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('일정 삭제 실패', { variant: 'error' });
      }
      setIsRecurringDialogOpen(false);
      setPendingRecurringDelete(null);
    }
  };

  const handleOverlapDialogClose = () => {
    setIsOverlapDialogOpen(false);
    // 드래그 앤 드롭 중이었다면 상태 초기화
    setPendingDraggedEvent(null);
    setOriginalDraggedEvent(null);
  };

  const handleOverlapDialogCancel = () => {
    setIsOverlapDialogOpen(false);
    // 드래그 앤 드롭 중이었다면 상태 초기화
    setPendingDraggedEvent(null);
    setOriginalDraggedEvent(null);
  };

  const handleOverlapDialogConfirm = async () => {
    setIsOverlapDialogOpen(false);

    // 드래그 앤 드롭으로 인한 겹침인 경우
    if (pendingDraggedEvent && originalDraggedEvent) {
      updateEventOptimistically(pendingDraggedEvent);
      
      // 반복 일정인 경우 해당 일정만 수정 (단일 편집 모드)
      if (isRecurringEvent(originalDraggedEvent)) {
        await handleRecurringEdit(pendingDraggedEvent, true);
      } else {
        await saveEvent(pendingDraggedEvent);
      }
      
      setEditingEvent(null);
      setPendingDraggedEvent(null);
      setOriginalDraggedEvent(null);
    } else {
      // 일반 폼에서의 겹침인 경우
      saveEvent({
        id: editingEvent ? editingEvent.id : undefined,
        title,
        date,
        startTime,
        endTime,
        description,
        location,
        category,
        repeat: {
          type: isRepeating ? repeatType : 'none',
          interval: repeatInterval,
          endDate: repeatEndDate || undefined,
        },
        notificationTime,
      });
    }
  };

  const isRecurringEvent = (event: Event): boolean => {
    return event.repeat.type !== 'none' && event.repeat.interval > 0;
  };

  const handleEditEvent = (event: Event) => {
    if (isRecurringEvent(event)) {
      // Show recurring edit dialog
      setPendingRecurringEdit(event);
      setRecurringDialogMode('edit');
      setIsRecurringDialogOpen(true);
    } else {
      // Regular event editing
      editEvent(event);
    }
  };

  const handleDeleteEvent = (event: Event) => {
    if (isRecurringEvent(event)) {
      // Show recurring delete dialog
      setPendingRecurringDelete(event);
      setRecurringDialogMode('delete');
      setIsRecurringDialogOpen(true);
    } else {
      // Regular event deletion
      deleteEvent(event.id);
    }
  };

  const handleCellClick = (date: string) => {
    // 빈 날짜 셀 클릭 시 폼에 해당 날짜 설정
    setDate(date);
  };

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: editingEvent
        ? editingEvent.repeat // Keep original repeat settings for recurring event detection
        : {
            type: isRepeating ? repeatType : 'none',
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
          },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    const hasOverlapEvent = overlapping.length > 0;

    // 수정
    if (editingEvent) {
      if (hasOverlapEvent) {
        setOverlappingEvents(overlapping);
        setIsOverlapDialogOpen(true);
        return;
      }

      if (
        editingEvent.repeat.type !== 'none' &&
        editingEvent.repeat.interval > 0 &&
        recurringEditMode !== null
      ) {
        await handleRecurringEdit(eventData as Event, recurringEditMode);
        setRecurringEditMode(null);
      } else {
        await saveEvent(eventData);
      }

      resetForm();
      return;
    }

    // 생성
    if (isRepeating) {
      // 반복 생성은 반복 일정을 고려하지 않는다.
      await createRepeatEvent(eventData);
      resetForm();
      return;
    }

    if (hasOverlapEvent) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
      return;
    }

    await saveEvent(eventData);
    resetForm();
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = event.active.data.current?.event as Event;
    setActiveEvent(draggedEvent);
    setEditingEvent(draggedEvent);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log('DragEnd event:', event);
    setActiveEvent(null);

    const { active, over } = event;

    if (!over) {
      setEditingEvent(null);
      return;
    }

    const draggedEvent = active.data.current?.event as Event;
    const updatedEvent = getUpdatedEventAfterDrag(event);
    if (!updatedEvent) {
      setEditingEvent(null);
      return;
    }

    // 일정 겹침 체크
    const overlapping = findOverlappingEvents(updatedEvent, events);
    if (overlapping.length > 0) {
      // 겹치는 일정이 있으면 원래 이벤트와 수정된 이벤트 저장
      setOriginalDraggedEvent(draggedEvent);
      setPendingDraggedEvent(updatedEvent);
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
      return;
    }

    // 겹침이 없으면 즉시 저장
    updateEventOptimistically(updatedEvent);

    // 반복 일정인 경우 해당 일정만 수정 (단일 편집 모드)
    if (isRecurringEvent(draggedEvent)) {
      await handleRecurringEdit(updatedEvent, true); // true = 해당 일정만 수정
    } else {
      // 일반 일정은 기존 방식으로 저장
      await saveEvent(updatedEvent);
    }
    
    setEditingEvent(null);
  };


  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <EventEditor
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={startTimeError}
          endTimeError={endTimeError}
          editingEvent={editingEvent}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          addOrUpdateEvent={addOrUpdateEvent}
        />

        <CalendarView
          view={view}
          setView={setView}
          currentDate={currentDate}
          holidays={holidays}
          navigate={navigate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          handleCellClick={handleCellClick}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          activeEvent={activeEvent}
        />

        <EventList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          handleEditEvent={handleEditEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      </Stack>

      <Dialog open={isOverlapDialogOpen} onClose={handleOverlapDialogClose}>
        <DialogTitle>일정 겹침 경고</DialogTitle>
        <DialogContent>
          <DialogContentText>다음 일정과 겹칩니다:</DialogContentText>
          {overlappingEvents.map((event) => (
            <Typography key={event.id} sx={{ ml: 1, mb: 1 }}>
              {event.title} ({event.date} {event.startTime}-{event.endTime})
            </Typography>
          ))}
          <DialogContentText>계속 진행하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOverlapDialogCancel}>취소</Button>
          <Button color="error" onClick={handleOverlapDialogConfirm}>
            계속 진행
          </Button>
        </DialogActions>
      </Dialog>

      <RecurringEventDialog
        open={isRecurringDialogOpen}
        onClose={() => {
          setIsRecurringDialogOpen(false);
          setPendingRecurringEdit(null);
          setPendingRecurringDelete(null);
        }}
        onConfirm={handleRecurringConfirm}
        event={recurringDialogMode === 'edit' ? pendingRecurringEdit : pendingRecurringDelete}
        mode={recurringDialogMode}
      />

      <NotificationAlert
        notifications={notifications}
        onRemoveNotification={(index) => {
          setNotifications((prev) => prev.filter((_, i) => i !== index));
        }}
      />
    </Box>
  );
}

export default App;
