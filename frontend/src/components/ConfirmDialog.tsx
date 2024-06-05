import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { Updater, useImmer } from "use-immer";

type ConfirmDialogProps = {
  onConfirm: (setClose: Updater<boolean>, data: unknown) => void;
};

export type ConfirmDialogHandles = {
  open: (title: string, content: string, data: unknown) => void;
};

const ConfirmDialog = forwardRef<ConfirmDialogHandles, ConfirmDialogProps>(
  ({ onConfirm }, ref) => {
    useImperativeHandle(ref, () => {
      return {
        open: (title: string, content: string, data: unknown) => {
          setTitle(title);
          setContent(content);
          setData(data);
          setOpen(true);
        },
      };
    });

    const [open, setOpen] = useImmer<boolean>(false);

    const [title, setTitle] = useImmer<string>("");

    const [content, setContent] = useImmer<string>("");

    const [data, setData] = useImmer<unknown>(null);

    const handleClose = () => {
      setOpen(false);
      setTitle("");
      setContent("");
    };

    return (
      <Dialog open={open} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" size="large">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(setOpen, data);
              handleClose();
            }}
            variant="outlined"
            size="large"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ConfirmDialog;
