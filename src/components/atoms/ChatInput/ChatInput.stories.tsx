/* eslint-disable no-console */
import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import ChatInput from './ChatInput';

export default {
  component: ChatInput,
  title: 'atoms/ChatInput',
} as Meta;

export const Default = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <ChatInput
      onSubmit={(e) => {
        e.preventDefault();
        setValue('');
        console.log(value);
      }}
      onChange={handleChange}
      value={value}
    />
  );
};
