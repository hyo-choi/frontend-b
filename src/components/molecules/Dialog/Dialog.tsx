import React from 'react';
import MaterialDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

type DialogProps = {
  title?: React.ReactNode,
  content: React.ReactNode,
  buttons?: React.ReactNode,
  isOpen: boolean,
  container?: HTMLElement | React.Component | (() => (React.ReactInstance | null)),
  // eslint-disable-next-line no-unused-vars
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void,
};

const Dialog = ({
  title, content, buttons, isOpen, onClose, container,
}: DialogProps) => (
  container ? (
    <MaterialDialog
      open={isOpen}
      onClose={onClose}
      container={container || document.body}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ position: 'absolute' }}
      BackdropProps={{ style: { position: 'absolute' } }}
      fullWidth
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      <DialogActions>{buttons}</DialogActions>
    </MaterialDialog>
  ) : (
    <MaterialDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      <DialogActions>{buttons}</DialogActions>
    </MaterialDialog>
  )
);

Dialog.defaultProps = {
  title: null,
  buttons: null,
  container: null,
};

export default Dialog;
