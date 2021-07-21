import React from 'react';
import { Meta } from '@storybook/react';
import LoginPage from './LoginPage';

export default {
  component: LoginPage,
  title: 'pages/LoginPage',
} as Meta;

export const Login = () => (
  <LoginPage />
);
