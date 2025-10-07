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

export interface OverlapDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback fired when the dialog should be closed */
  onClose: () => void;
  /** Callback fired when user confirms to proceed with overlapping event */
  onConfirm: () => void;
  /** List of overlapping events */
  overlappingEvents: Event[];
}

/**
 * Dialog component for handling event overlap warnings
 * Shows a list of overlapping events and asks user confirmation to proceed
 */
export default function OverlapDialog({
  open,
  onClose,
  onConfirm,
  overlappingEvents,
}: OverlapDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

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
        <DialogContentText id="overlap-dialog-description">다음 일정과 겹칩니다:</DialogContentText>

        {overlappingEvents.map((event) => (
          <Typography key={event.id} sx={{ ml: 1, mb: 1 }} component="div">
            {event.title} ({event.date} {event.startTime}-{event.endTime})
          </Typography>
        ))}

        <DialogContentText sx={{ mt: 2 }}>계속 진행하시겠습니까?</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
}
