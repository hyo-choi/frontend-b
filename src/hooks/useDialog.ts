import React, { useState } from 'react';

// eslint-disable-next-line no-unused-vars
export type OnCloseType = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
// eslint-disable-next-line no-unused-vars
export type SetOpenType = (value: boolean) => void;
// eslint-disable-next-line no-unused-vars
export type SetDialogType = (value: DialogProps) => void;

export type DialogProps = {
  title?: React.ReactNode,
  content: React.ReactNode,
  buttons?: React.ReactNode,
  onClose: OnCloseType,
};

export const initialDialog = {
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
