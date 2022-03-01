import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';
import Menu from './Menu';
import ContextProvider from '~hooks/useContext';

export default {
  title: 'molecules/Menu',
  component: Menu,
} as Meta;

export const Default = () => (
  <BrowserRouter>
    <ContextProvider>
      <Menu />
    </ContextProvider>
  </BrowserRouter>
);
