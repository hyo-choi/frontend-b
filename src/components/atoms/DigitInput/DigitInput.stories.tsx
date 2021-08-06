import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import DigitInput from './DigitInput';

export default {
  component: DigitInput,
  title: 'atoms/DigitInput',
} as Meta;

export const Default = () => {
  const [value, setValue] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const letter = /^[0-9]$/;
    if (event.target.value === '' || letter.test(event.target.value)) setValue(event.target.value);
  };
  return (<DigitInput onChange={handleChange} value={value} />);
};
