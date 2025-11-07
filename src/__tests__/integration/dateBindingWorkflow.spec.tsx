import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, expect, test } from 'vitest';

import { setupMockHandlerCreation } from '../../__mocks__/handlersUtils';
import App from '../../App';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('빈 셀 클릭 시 날짜 바인딩 워크플로우', () => {
  test('월간 뷰에서 빈 날짜 셀을 클릭하면 왼쪽 폼의 날짜 필드에 해당 날짜가 자동으로 설정된다', async () => {
    const { user } = setup(<App />);

    // Given: 월간 뷰가 표시됨
    const monthView = screen.getByTestId('month-view');
    expect(monthView).toBeInTheDocument();

    // 초기 날짜 필드 상태 확인 (비어있음)
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('');

    // When: 특정 날짜 셀(15일)의 빈 공간을 클릭
    const cells = within(monthView).getAllByRole('cell');
    const targetCell = cells.find((cell) => {
      const text = cell.textContent;
      return text && /^15/.test(text) && !text.includes('반복일정'); // 이벤트가 없는 빈 셀
    });

    expect(targetCell).toBeDefined();
    await user.click(targetCell!);

    // Then: 왼쪽 폼의 날짜 필드에 해당 날짜가 자동으로 설정됨
    expect(dateInput.value).toBe('2025-10-15');

    // And: 다른 폼 필드들은 변경되지 않음
    const titleInput = screen.getByLabelText('제목') as HTMLInputElement;
    const startTimeInput = screen.getByLabelText('시작 시간') as HTMLInputElement;
    const endTimeInput = screen.getByLabelText('종료 시간') as HTMLInputElement;

    expect(titleInput.value).toBe('');
    expect(startTimeInput.value).toBe('');
    expect(endTimeInput.value).toBe('');
  });

  test('주간 뷰에서 빈 날짜 셀을 클릭하여 날짜가 설정된 후 일정을 생성하면 해당 날짜에 일정이 추가된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    // Given: 주간 뷰로 전환
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    const weekView = screen.getByTestId('week-view');
    expect(weekView).toBeInTheDocument();

    // When: 특정 날짜 셀(3일)의 빈 공간을 클릭
    const cells = within(weekView).getAllByRole('cell');
    const targetCell = cells.find((cell) => {
      const text = cell.textContent;
      return text && /^3$/.test(text); // 3일 찾기
    });

    expect(targetCell).toBeDefined();
    await user.click(targetCell!);

    // Then: 왼쪽 폼의 날짜 필드에 해당 날짜가 설정됨
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-03');

    // And: 해당 날짜로 일정을 생성
    await user.type(screen.getByLabelText('제목'), '날짜 바인딩 테스트 일정');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.type(screen.getByLabelText('설명'), '빈 셀 클릭으로 생성');
    await user.type(screen.getByLabelText('위치'), '테스트 장소');

    // 카테고리 선택
    await user.click(screen.getByLabelText('카테고리'));
    await user.click(within(screen.getByLabelText('카테고리')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '업무-option' }));

    // 일정 저장
    await user.click(screen.getByTestId('event-submit-button'));

    // Then: 일정이 성공적으로 생성되고 이벤트 리스트에 표시됨
    const addedEvents = await screen.findAllByText('날짜 바인딩 테스트 일정');
    expect(addedEvents.length).toBeGreaterThan(0);

    // And: 폼이 초기화됨
    expect(dateInput.value).toBe('');
    const titleInput = screen.getByLabelText('제목') as HTMLInputElement;
    expect(titleInput.value).toBe('');
  });
});
