import React, { useEffect } from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ChatPage from './ChatPage';
import ContextProvider from '../../../utils/hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import { useAppDispatch } from '../../../utils/hooks/useAppContext';

export default {
  component: ChatPage,
  title: 'pages/ChatPage',
} as Meta;

const ChatWithContext = () => {
  const appDispatch = useAppDispatch();
  useEffect(() => {
    appDispatch({ type: 'enterChat', chatting: { type: 'channel', name: 'SampleRoom' } });
  }, []);
  return (<ChatPage />);
};

export const Chatting = () => (
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
        main={<h3>Main</h3>}
        chat={<ChatWithContext />}
      />
    </ContextProvider>
  </BrowserRouter>
);

export const NotChatting = () => (
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
        main={<h3>Main</h3>}
        chat={<ChatPage />}
      />
    </ContextProvider>
  </BrowserRouter>
);
