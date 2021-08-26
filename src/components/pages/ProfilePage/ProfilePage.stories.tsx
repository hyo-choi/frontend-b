import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { ToastContainer } from 'react-toastify';
import { ContextProvider, useUserDispatch } from '../../../utils/hooks/useContext';
import ProfilePage from './ProfilePage';
import { UserInfoType } from '../../../types/User';

export default {
  component: ProfilePage,
  title: 'pages/ProfilePage',
} as Meta;

const ProfilePageWithContext = () => {
  const userDispatch = useUserDispatch();
  const userInfo: UserInfoType = {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'MYNAME',
    avatar: '',
    status: 'ONLINE',
  };

  useEffect(() => {
    userDispatch({
      type: 'login',
      info: {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
        enable2FA: false,
        authenticatorSecret: false,
        isSecondFactorAuthenticated: false,
      },
    });
  }, []);

  return <Route path="/" component={ProfilePage} />;
};

export const OthersProfile = () => (
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
      <ProfilePageWithContext />
    </ContextProvider>
  </BrowserRouter>
);
