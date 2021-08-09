import React from 'react';
import MaterialDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

type DialogProps = {
  title?: React.ReactNode,
  content: React.ReactNode,
  buttons: React.ReactNode,
  isOpen: boolean,
  // eslint-disable-next-line no-unused-vars
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void,
};

const Dialog = ({
  title, content, buttons, isOpen, handleClose,
  // eslint-disable-next-line arrow-body-style
}: DialogProps) => {
  return (
    <MaterialDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      <DialogActions>{buttons}</DialogActions>
    </MaterialDialog>
  );
};

Dialog.defaultProps = {
  title: null,
};

export default Dialog;
