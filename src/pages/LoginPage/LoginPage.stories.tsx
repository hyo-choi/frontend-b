import React from 'react';
import { Meta } from '@storybook/react';
import LoginPage from './LoginPage';
import ContextProvider from '~hooks/useContext';

export default {
  component: LoginPage,
  title: 'pages/LoginPage',
} as Meta;

export const Login = () => (
  <ContextProvider>
    <LoginPage />
  </ContextProvider>
);
