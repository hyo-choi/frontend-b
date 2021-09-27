import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import GameListItem, { GameListItemSkeleton } from './GameListItem';
import List from '../../atoms/List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import ContextProvider from '../../../utils/hooks/useContext';
import { UserInfoType } from '../../../types/User';

export default {
  title: 'organisms/GameListItem',
  component: GameListItem,
} as Meta;

const userFirst: UserInfoType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'userFirst',
  avatar: 'https://material-ui.com/static/images/avatar/1.jpg',
  status: 'OFFLINE',
};

const userSecond: UserInfoType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'userSecond',
  avatar: 'https://material-ui.com/static/images/avatar/2.jpg',
  status: 'OFFLINE',
};

const Normal = () => (
  <GameListItem
    leftUser={userFirst}
    rightUser={userSecond}
    mode="CLASSIC"
    onClick={() => {}}
  />
);

const Reverse = () => (
  <GameListItem
    leftUser={userSecond}
    rightUser={userFirst}
    mode="REVERSE"
    onClick={() => {}}
  />
);

const Speed = () => (
  <GameListItem
    leftUser={userFirst}
    rightUser={userSecond}
    mode="SPEED"
    onClick={() => {}}
  />
);

export const Default = () => <Normal />;

export const SkeletonGameListItem = () => <GameListItemSkeleton />;

export const WithList = () => (
  <List scroll height="15em">
    <Normal />
    <Reverse />
    <Speed />
    <Reverse />
    <Normal />
    <Reverse />
    <Speed />
  </List>
);

export const WithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<WithList />}
        chat={<h1>Chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);
