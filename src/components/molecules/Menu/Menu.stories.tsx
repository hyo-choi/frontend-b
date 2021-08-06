import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';
import Menu from './Menu';
import { ContextProvider } from '../../../utils/hooks/useContext';

export default {
  title: 'molecules/Menu',
  component: Menu,
} as Meta;

// eslint-disable-next-line arrow-body-style
export const Default = () => {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Menu />
      </ContextProvider>
    </BrowserRouter>
  );
};
