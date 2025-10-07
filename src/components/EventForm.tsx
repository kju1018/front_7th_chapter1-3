import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChangeEvent } from 'react';

import { categories, notificationOptions } from '../constants';
import { RepeatType } from '../types';

export interface EventFormProps {
  // Basic form fields
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;

  // Repeat fields
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;

  // Notification
  notificationTime: number;

  // Error states
  startTimeError: string | null;
  endTimeError: string | null;

  // Form state
  isEditing: boolean;

  // Event handlers
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStartTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEndTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onIsRepeatingChange: (checked: boolean) => void;
  onRepeatTypeChange: (value: RepeatType) => void;
  onRepeatIntervalChange: (value: number) => void;
  onRepeatEndDateChange: (value: string) => void;
  onNotificationTimeChange: (value: number) => void;
  onSubmit: () => void;
  onTimeBlur?: () => void;
}

/**
 * Event creation and editing form component
 * Supports both regular and recurring events with validation
 */
export default function EventForm({
  title,
  date,
  startTime,
  endTime,
  description,
  location,
  category,
  isRepeating,
  repeatType,
  repeatInterval,
  repeatEndDate,
  notificationTime,
  startTimeError,
  endTimeError,
  isEditing,
  onTitleChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onDescriptionChange,
  onLocationChange,
  onCategoryChange,
  onIsRepeatingChange,
  onRepeatTypeChange,
  onRepeatIntervalChange,
  onRepeatEndDateChange,
  onNotificationTimeChange,
  onSubmit,
  onTimeBlur,
}: EventFormProps) {
  const handleRepeatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    onIsRepeatingChange(checked);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h4">{isEditing ? '일정 수정' : '일정 추가'}</Typography>

      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField
          id="title"
          size="small"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField
          id="date"
          size="small"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <Tooltip title={startTimeError || ''} open={!!startTimeError} placement="top">
            <TextField
              id="start-time"
              size="small"
              type="time"
              value={startTime}
              onChange={onStartTimeChange}
              onBlur={onTimeBlur}
              error={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <Tooltip title={endTimeError || ''} open={!!endTimeError} placement="top">
            <TextField
              id="end-time"
              size="small"
              type="time"
              value={endTime}
              onChange={onEndTimeChange}
              onBlur={onTimeBlur}
              error={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="location">위치</FormLabel>
        <TextField
          id="location"
          size="small"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select
          id="category"
          size="small"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-labelledby="category-label"
          aria-label="카테고리"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!isEditing && (
        <FormControl>
          <FormControlLabel
            control={<Checkbox checked={isRepeating} onChange={handleRepeatingChange} />}
            label="반복 일정"
          />
        </FormControl>
      )}

      {isRepeating && !isEditing && (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel>반복 유형</FormLabel>
            <Select
              size="small"
              value={repeatType}
              aria-label="반복 유형"
              onChange={(e) => onRepeatTypeChange(e.target.value as RepeatType)}
            >
              <MenuItem value="daily" aria-label="daily-option">
                매일
              </MenuItem>
              <MenuItem value="weekly" aria-label="weekly-option">
                매주
              </MenuItem>
              <MenuItem value="monthly" aria-label="monthly-option">
                매월
              </MenuItem>
              <MenuItem value="yearly" aria-label="yearly-option">
                매년
              </MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
              <TextField
                id="repeat-interval"
                size="small"
                type="number"
                value={repeatInterval}
                onChange={(e) => onRepeatIntervalChange(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
              <TextField
                id="repeat-end-date"
                size="small"
                type="date"
                value={repeatEndDate}
                onChange={(e) => onRepeatEndDateChange(e.target.value)}
              />
            </FormControl>
          </Stack>
        </Stack>
      )}

      <FormControl fullWidth>
        <FormLabel htmlFor="notification">알림 설정</FormLabel>
        <Select
          id="notification"
          size="small"
          value={notificationTime}
          onChange={(e) => onNotificationTimeChange(Number(e.target.value))}
        >
          {notificationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        data-testid="event-submit-button"
        onClick={onSubmit}
        variant="contained"
        color="primary"
        fullWidth
      >
        {isEditing ? '일정 수정' : '일정 추가'}
      </Button>
    </Stack>
  );
}
