import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CommunityPage from './CommunityPage';
import { ContextProvider } from '../../../utils/hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';

export default {
  component: CommunityPage,
  title: 'pages/CommunityPage',
} as Meta;

export const Community = () => (
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
        path={['/community', '/']}
        render={() => (
          <MainTemplate
            main={<CommunityPage />}
            chat={<h1>chat</h1>}
          />
        )}
      />
    </ContextProvider>
  </BrowserRouter>
);
