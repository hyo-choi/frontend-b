import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import MatchListItem, { MatchListItemSkeleton } from './MatchListItem';
import List from '~components/atoms/List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import ContextProvider from '~hooks/useContext';
import { MatchType } from '~types/Match';
import { UserInfoType } from '~types/User';

export default {
  title: 'organisms/MatchListItem',
  component: MatchListItem,
} as Meta;

const me: UserInfoType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'ME',
  avatar: '',
  status: 'OFFLINE',
};

const opposite: UserInfoType = {
  id: '661e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'OPPOSITE',
  avatar: '',
  status: 'OFFLINE',
};

const winCase: MatchType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  createdAt: new Date(),
  mode: 'REVERSE',
  type: 'LADDER',
  user1: { ...me, score: 0 },
  user2: { ...opposite, score: 0 },
  winner: me,
  loser: opposite,
};

const loseCase: MatchType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  createdAt: new Date(),
  mode: 'SPEED',
  type: 'LADDER',
  user1: { ...me, score: 0 },
  user2: { ...opposite, score: 0 },
  winner: opposite,
  loser: me,
};

const fakeList: MatchType[] = [
  winCase, loseCase, { ...winCase, mode: 'CLASSIC' }, { ...loseCase, mode: 'REVERSE' }, winCase,
];

export const Default = () => (
  <MatchListItem opposite={opposite} mode="CLASSIC" isMeWinner createdAt={new Date()} />
);

export const Skeleton = () => <MatchListItemSkeleton />;

export const WithList = () => (
  <List scroll height="15em">
    {fakeList.map((info) => (
      <MatchListItem
        opposite={info.user1.id === me.id ? info.user2 : info.user1}
        mode={info.mode}
        isMeWinner={info.winner?.id !== opposite.id}
        createdAt={new Date()}
      />
    ))}
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
