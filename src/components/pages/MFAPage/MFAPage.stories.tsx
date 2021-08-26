import React from 'react';
import { Meta } from '@storybook/react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import MFAPage from './MFAPage';
import { ContextProvider } from '../../../utils/hooks/useContext';

export default {
  component: MFAPage,
  title: 'pages/MFAPage',
} as Meta;

export const Login = () => (
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
      <MFAPage />
    </ContextProvider>
  </BrowserRouter>
);
