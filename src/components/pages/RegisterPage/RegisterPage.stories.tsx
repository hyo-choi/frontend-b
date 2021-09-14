import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Meta } from '@storybook/react';
import RegisterPage from './RegisterPage';
import ContextProvider from '../../../utils/hooks/useContext';

export default {
  component: RegisterPage,
  title: 'pages/RegisterPage',
} as Meta;

export const Register = () => (
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
      <RegisterPage />
    </ContextProvider>
  </BrowserRouter>
);
