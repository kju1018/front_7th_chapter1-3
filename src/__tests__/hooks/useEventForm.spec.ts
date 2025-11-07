import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { useEventForm } from '../../hooks/useEventForm';
import { Event } from '../../types';

describe('useEventForm', () => {
  it('반복 일정 이벤트로 초기화하면 반복 관련 값들이 설정되어야 한다', () => {
    const repeatingEvent: Event = {
      id: '2',
      title: '주간 미팅',
      date: '2025-11-10',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-31',
      },
      notificationTime: 10,
    };

    const { result } = renderHook(() => useEventForm(repeatingEvent));

    expect(result.current.isRepeating).toBe(true);
    expect(result.current.repeatType).toBe('weekly');
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe('2025-12-31');
  });

  describe('시간 유효성 검사', () => {
    it('handleStartTimeChange로 시작 시간을 변경하면 startTime이 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        const event = { target: { value: '09:00' } } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleStartTimeChange(event);
      });

      expect(result.current.startTime).toBe('09:00');
    });

    it('종료 시간이 시작 시간보다 빠르면 에러가 발생해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        const startEvent = { target: { value: '10:00' } } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleStartTimeChange(startEvent);
      });

      act(() => {
        const endEvent = { target: { value: '09:00' } } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleEndTimeChange(endEvent);
      });

      expect(result.current.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
    });

    it('시작 시간을 변경하여 종료 시간보다 늦게 설정하면 에러가 발생해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        const endEvent = { target: { value: '10:00' } } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleEndTimeChange(endEvent);
      });

      act(() => {
        const startEvent = { target: { value: '11:00' } } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleStartTimeChange(startEvent);
      });

      expect(result.current.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
    });
  });
});
