import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';
import Menu from './Menu';

export default {
  title: 'molecules/Menu',
  component: Menu,
} as Meta;

// eslint-disable-next-line arrow-body-style
export const Default = () => {
  return (
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );
};
