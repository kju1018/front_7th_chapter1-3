import Close from '@mui/icons-material/Close';
import { Alert, AlertTitle, IconButton, Stack } from '@mui/material';

interface Notification {
  id: string;
  message: string;
}

interface NotificationAlertProps {
  notifications: Notification[];
  onRemoveNotification: (index: number) => void;
}

/**
 * 우측 상단에 고정되어 표시되는 알림 컴포넌트
 * @param notifications - 표시할 알림 배열
 * @param onRemoveNotification - 알림 제거 핸들러
 */
export function NotificationAlert({
  notifications,
  onRemoveNotification,
}: NotificationAlertProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
      {notifications.map((notification, index) => (
        <Alert
          key={index}
          severity="info"
          sx={{ width: 'auto' }}
          action={
            <IconButton
              size="small"
              onClick={() => onRemoveNotification(index)}
            >
              <Close />
            </IconButton>
          }
        >
          <AlertTitle>{notification.message}</AlertTitle>
        </Alert>
      ))}
    </Stack>
  );
}

