import React from 'react';
import { Meta, Story } from '@storybook/react';
import Input, { InputProps } from './Input';

export default {
  component: Input,
  title: 'atoms/Input',
} as Meta;

const InputStory: Story<InputProps> = ({
  onChange, type, label,
}: InputProps) => (
  <>
    <Input
      onChange={onChange}
      type={type}
      label={label}
      helperText={`${type} input helper`}
    />
    <Input
      onChange={onChange}
      type={type}
      label={`${type} error`}
      defaultValue={type === 'number' ? '4242' : 'text input'}
      helperText={`${type} input helper`}
      error
    />
    <Input
      onChange={onChange}
      type={type}
      label={`${type} disabled`}
      defaultValue="disabled input"
      helperText={`${type} input helper`}
      disabled
    />
  </>
);

export const Text = InputStory.bind({});
Text.args = {
  onChange: () => {},
  type: 'text',
  label: 'text label',
};

export const Num = InputStory.bind({});
Num.args = {
  onChange: () => {},
  type: 'number',
  label: 'number label',
};

export const Password = InputStory.bind({});
Password.args = {
  onChange: () => {},
  type: 'password',
  label: 'password label',
};
