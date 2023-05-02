import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { PropsWithChildren } from "react";

export type DeleteConfirmModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  content?: string;
  confirmButtonText?: string;
  closeButtonText?: string;
}>;

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  children,
  title,
  content,
  confirmButtonText,
  closeButtonText,
}: DeleteConfirmModalProps) => {
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title || "Silme Onayı"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content || "Seçili kaydı silmek istiyor musunuz?"}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{closeButtonText || "Vazgeç"}</Button>
          <Button onClick={onConfirm} autoFocus>
            {confirmButtonText || "Sil"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
