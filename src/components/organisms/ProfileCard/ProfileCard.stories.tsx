import React, { useEffect } from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import ContextProvider from '../../../utils/hooks/useContext';
import { useUserDispatch } from '../../../utils/hooks/useUserContext';
import ProfileCard, { ProfileCardSkeleton } from './ProfileCard';
import { RelatedInfoType } from '../../../types/User';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import Typo from '../../atoms/Typo/Typo';
import List from '../../atoms/List/List';
import ListItem from '../../atoms/ListItem/ListItem';
import useDialog from '../../../utils/hooks/useDialog';
import Dialog from '../../molecules/Dialog/Dialog';

export default {
  title: 'organisms/ProfileCard',
  component: ProfileCard,
} as Meta;

export const OthersProfile = () => {
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const userInfo: RelatedInfoType = {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'USERNAME',
    avatar: '',
    status: 'OFFLINE',
    relationship: 'NONE',
    score: 0,
    win: 0,
    lose: 0,
  };

  return (
    <ContextProvider>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <Typo align="center">프로필에서는 이렇게 보입니다.</Typo>
      <ProfileCard
        userInfo={{ ...userInfo, name: 'NONE' }}
        setUser={() => {}}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
      <ProfileCard
        userInfo={{
          ...userInfo,
          name: 'FRIEND',
          relationship: 'FRIEND',
          status: 'ONLINE',
        }}
        setUser={() => {}}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
      <ProfileCard
        userInfo={{
          ...userInfo,
          name: 'REQUESTING',
          relationship: 'REQUESTING',
          status: 'IN_GAME',
        }}
        setUser={() => {}}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
      <ProfileCard
        userInfo={{ ...userInfo, name: 'REQUESTED', relationship: 'REQUESTED' }}
        setUser={() => {}}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
      <ProfileCard
        userInfo={{ ...userInfo, name: 'BLOCKED', relationship: 'BLOCKED' }}
        setUser={() => {}}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
      <ProfileCard
        userInfo={{ ...userInfo, name: 'BLOCKING', relationship: 'BLOCKING' }}
        setUser={() => {}}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
    </ContextProvider>
  );
};

export const OthersList = () => {
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const userInfo: RelatedInfoType = {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'USERNAME',
    avatar: '',
    status: 'OFFLINE',
    relationship: 'NONE',
    score: 0,
    win: 0,
    lose: 0,
  };

  return (
    <ContextProvider>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <Typo align="center">유저 리스트에서는 이렇게 보입니다.</Typo>
      <List height="70vh" scroll>
        <ListItem>
          <ProfileCard
            setUser={() => {}}
            userInfo={{
              ...userInfo,
              name: 'NONE',
              relationship: 'NONE',
              status: 'ONLINE',
            }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
        <ListItem>
          <ProfileCard
            setUser={() => {}}
            userInfo={{
              ...userInfo,
              name: 'FRIEND',
              relationship: 'FRIEND',
              status: 'IN_GAME',
            }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
        <ListItem>
          <ProfileCard
            setUser={() => {}}
            userInfo={{ ...userInfo, name: 'REQUESTING', relationship: 'REQUESTING' }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
        <ListItem>
          <ProfileCard
            setUser={() => {}}
            userInfo={{ ...userInfo, name: 'REQUESTED', relationship: 'REQUESTED' }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
        <ListItem>
          <ProfileCard
            setUser={() => {}}
            userInfo={{ ...userInfo, name: 'BLOCKED', relationship: 'BLOCKED' }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
        <ListItem>
          <ProfileCard
            setUser={() => {}}
            userInfo={{ ...userInfo, name: 'BLOCKING', relationship: 'BLOCKING' }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
      </List>
    </ContextProvider>
  );
};

const ProfileCardWithContext = () => {
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const userDispatch = useUserDispatch();
  const userInfo: RelatedInfoType = {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'ME',
    avatar: '',
    status: 'ONLINE',
    relationship: 'NONE',
    score: 0,
    win: 0,
    lose: 0,
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

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <ProfileCard
        setUser={() => {}}
        userInfo={userInfo}
        setOpen={setOpen}
        setDialog={setDialog}
        profile
      />
    </>
  );
};

export const MyProfile = () => (
  <ContextProvider>
    <ProfileCardWithContext />
  </ContextProvider>
);

export const SkeletonCard = () => (
  <ProfileCardSkeleton />
);

export const OthersProfileWithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<OthersProfile />}
        chat={<h1>chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);

export const OthersListWithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<OthersList />}
        chat={<h1>chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);

export const MyProfileWithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<ProfileCardWithContext />}
        chat={<h1>chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);
