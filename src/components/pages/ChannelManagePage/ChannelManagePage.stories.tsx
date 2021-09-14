import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ChannelManagePage from './ChannelManagePage';
import ContextProvider from '../../../utils/hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';

export default {
  component: ChannelManagePage,
  title: 'pages/ChannelManagePage',
} as Meta;

export const Channel = () => (
  <BrowserRouter>
    <ContextProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MainTemplate
        main={<Route path="/" component={ChannelManagePage} />}
        chat={<h1>chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);
