import React, { useState } from 'react';

type DialogProps = {
  title?: React.ReactNode,
  content: React.ReactNode,
  buttons?: React.ReactNode,
  // eslint-disable-next-line no-unused-vars
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void,
};

const initialDialog = {
  content: '',
  buttons: null,
  onClose: () => {},
};

const useDialog = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [dialog, setDialog] = useState<DialogProps>(initialDialog);

  return {
    isOpen, setOpen, dialog, setDialog,
  };
};

export default useDialog;
