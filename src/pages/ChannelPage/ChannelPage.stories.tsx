import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ChannelPage from './ChannelPage';
import ContextProvider from '~hooks/useContext';
import MainTemplate from '~components/templates/MainTemplate/MainTemplate';

export default {
  component: ChannelPage,
  title: 'pages/ChannelPage',
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
      <Route
        path={['/channel', '/']}
        render={() => (
          <MainTemplate
            main={<ChannelPage />}
            chat={<h1>chat</h1>}
          />
        )}
      />
    </ContextProvider>
  </BrowserRouter>
);
