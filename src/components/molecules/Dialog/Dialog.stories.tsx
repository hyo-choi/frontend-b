/* eslint-disable no-console */
import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import Dialog from './Dialog';
import { Button, Input, Typo } from '~components/index';

export default {
  component: Dialog,
  title: 'molecules/Dialog',
} as Meta;

export const Default = () => {
  const [isOpen, setOpen] = useState(false);
  const buttons = <Button variant="text" onClick={() => { setOpen(false); }}>CLOSE</Button>;

  return (
    <>
      <Button onClick={() => { setOpen(true); }}>OPEN DIALOG</Button>
      <Dialog
        title="SAMPLE DIALOG"
        content="This is sample dialog message"
        isOpen={isOpen}
        buttons={buttons}
        onClose={() => { setOpen(false); }}
      />
    </>
  );
};

export const WithForm = () => {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');

  const handleClose = () => {
    setValue('');
    setOpen(false);
  };

  const handleSubmit = () => {
    if (value.length > 0 && value.length < 11) {
      console.log(`처리되었습니다. 입력: ${value}`);
      handleClose();
    } else console.log('1~10글자 사이로 입력하세요.');
  };

  const buttons = (
    <>
      <Button variant="text" onClick={handleSubmit}>SUBMIT</Button>
      <Button variant="text" onClick={handleClose}>CLOSE</Button>
    </>
  );

  const form = (
    <form>
      <Typo>1~10글자 입력하면 제출 후 콘솔에서 결과를 확인할 수 있습니다.</Typo>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); }}
      />
    </form>
  );

  return (
    <>
      <Button onClick={() => { setOpen(true); }}>OPEN DIALOG</Button>
      <Dialog
        title="SAMPLE DIALOG"
        content={form}
        isOpen={isOpen}
        buttons={buttons}
        onClose={handleClose}
      />
    </>
  );
};
