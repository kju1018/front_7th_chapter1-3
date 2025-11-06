import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

import { Event } from '../types';

interface OverlapDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  overlappingEvents: Event[];
}

export function OverlapDialog({
  open,
  onClose,
  onConfirm,
  overlappingEvents,
}: OverlapDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="overlap-dialog-title"
      aria-describedby="overlap-dialog-description"
    >
      <DialogTitle id="overlap-dialog-title">일정 겹침 경고</DialogTitle>

      <DialogContent>
        <DialogContentText id="overlap-dialog-description">
          다음 일정과 겹칩니다:
        </DialogContentText>
        {overlappingEvents.map((event) => (
          <Typography key={event.id} sx={{ ml: 1, mb: 1 }}>
            {event.title} ({event.date} {event.startTime}-{event.endTime})
          </Typography>
        ))}
        <DialogContentText sx={{ mt: 2 }}>계속 진행하시겠습니까?</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button color="error" onClick={onConfirm} variant="contained">
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
}

