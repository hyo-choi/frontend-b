import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DMPage from './DMPage';
import ContextProvider from '~hooks/useContext';
import MainTemplate from '~components/templates/MainTemplate/MainTemplate';

export default {
  component: DMPage,
  title: 'pages/DMPage',
} as Meta;

export const Default = () => (
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
        main={<Route path="/" component={DMPage} />}
        chat={<h1>chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);
