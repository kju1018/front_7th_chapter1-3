import { DragEndEvent } from '@dnd-kit/core';
import { describe, it, expect } from 'vitest';

import type { Event } from '../../types';
import { getUpdatedEventAfterDrag } from '../../utils/dragUtils';

describe('dragUtils', () => {
  describe('getUpdatedEventAfterDrag', () => {
    const mockEvent: Event = {
      id: '1',
      title: '테스트 이벤트',
      date: '2024-01-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '테스트 설명',
      location: '테스트 장소',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 10,
    };

    it('드래그하여 날짜가 변경되면 새로운 날짜로 업데이트된 이벤트를 반환해야 한다', () => {
      const dragEndEvent = {
        active: {
          data: {
            current: {
              event: mockEvent,
            },
          },
        },
        over: {
          data: {
            current: {
              date: '2024-01-05',
            },
          },
        },
      } as unknown as DragEndEvent;

      const result = getUpdatedEventAfterDrag(dragEndEvent);

      expect(result).not.toBeNull();
      expect(result).toEqual({
        ...mockEvent,
        date: '2024-01-05',
      });
    });

    it('draggedEvent가 없으면 null을 반환해야 한다', () => {
      const dragEndEvent = {
        active: {
          data: {
            current: null,
          },
        },
        over: {
          data: {
            current: {
              date: '2024-01-05',
            },
          },
        },
      } as unknown as DragEndEvent;

      const result = getUpdatedEventAfterDrag(dragEndEvent);

      expect(result).toBeNull();
    });

    it('newDate가 없으면 null을 반환해야 한다', () => {
      const dragEndEvent = {
        active: {
          data: {
            current: {
              event: mockEvent,
            },
          },
        },
        over: {
          data: {
            current: null,
          },
        },
      } as unknown as DragEndEvent;

      const result = getUpdatedEventAfterDrag(dragEndEvent);

      expect(result).toBeNull();
    });

    it('over가 null이면 null을 반환해야 한다', () => {
      const dragEndEvent = {
        active: {
          data: {
            current: {
              event: mockEvent,
            },
          },
        },
        over: null,
      } as unknown as DragEndEvent;

      const result = getUpdatedEventAfterDrag(dragEndEvent);

      expect(result).toBeNull();
    });

    it('날짜가 같으면 null을 반환해야 한다', () => {
      const dragEndEvent = {
        active: {
          data: {
            current: {
              event: mockEvent,
            },
          },
        },
        over: {
          data: {
            current: {
              date: '2024-01-01', // mockEvent와 같은 날짜
            },
          },
        },
      } as unknown as DragEndEvent;

      const result = getUpdatedEventAfterDrag(dragEndEvent);

      expect(result).toBeNull();
    });

    it('드래그한 이벤트의 다른 속성들은 유지되어야 한다', () => {
      const dragEndEvent = {
        active: {
          data: {
            current: {
              event: mockEvent,
            },
          },
        },
        over: {
          data: {
            current: {
              date: '2024-01-10',
            },
          },
        },
      } as unknown as DragEndEvent;

      const result = getUpdatedEventAfterDrag(dragEndEvent);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(mockEvent.id);
      expect(result?.title).toBe(mockEvent.title);
      expect(result?.startTime).toBe(mockEvent.startTime);
      expect(result?.endTime).toBe(mockEvent.endTime);
      expect(result?.description).toBe(mockEvent.description);
      expect(result?.location).toBe(mockEvent.location);
      expect(result?.category).toBe(mockEvent.category);
      expect(result?.date).toBe('2024-01-10');
    });
  });
});
