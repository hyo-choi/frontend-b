import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import Switch from './Switch';

export default {
  title: 'atoms/Switch',
  component: Switch,
} as Meta;

export const Default = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <Switch
        checked={isChecked}
        onChange={() => { setIsChecked(!isChecked); }}
        name="2FAswitch"
      />
    </>
  );
};
