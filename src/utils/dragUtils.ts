import { DragEndEvent } from '@dnd-kit/core';

import type { Event } from '../types.ts';

export const getUpdatedEventAfterDrag = (event: DragEndEvent): Event | null => {
  const draggedEvent = event.active.data.current?.event as Event;
  const newDate = event.over?.data.current?.date as string;
  if (!draggedEvent || !newDate) return null;
  if (draggedEvent.date === newDate) return null;
  return { ...draggedEvent, date: newDate };
};
