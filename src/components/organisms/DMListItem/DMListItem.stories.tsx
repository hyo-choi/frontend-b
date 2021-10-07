import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import DMListItem, { DMListItemSkeleton } from './DMListItem';
import { DMRoomType } from '../../../types/Chat';
import List from '../../atoms/List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import ContextProvider from '../../../utils/hooks/useContext';

export default {
  title: 'organisms/DMListItem',
  component: DMListItem,
} as Meta;

const ShortMessageDMRoomInfo: DMRoomType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'USERNAME',
  avatar: '',
  status: 'OFFLINE',
  latestMessage: {
    type: 'DM',
    name: 'USERNAME',
    content: 'Lorem ips',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'USERNAME',
      avatar: '',
      status: 'OFFLINE',
    },
    id: '550e8400-e29b-41d4-a716-446655440000',
    createdAt: new Date(),
  },
  unreads: 0,
};

const MediumMessageDMRoomInfo: DMRoomType = {
  ...ShortMessageDMRoomInfo,
  latestMessage: {
    ...ShortMessageDMRoomInfo.latestMessage,
    content: 'Lorem ipsum dolor',
  },
};

const LongMessageDMRoomInfo: DMRoomType = {
  ...ShortMessageDMRoomInfo,
  latestMessage: {
    ...ShortMessageDMRoomInfo.latestMessage,
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,',
  },
};

export const Default = () => (
  <ContextProvider><DMListItem roomInfo={ShortMessageDMRoomInfo} /></ContextProvider>
);

export const SkeletonChannel = () => <ContextProvider><DMListItemSkeleton /></ContextProvider>;

export const WithList = () => {
  const aDay: number = 86400000;
  const anHour: number = 3600000;
  const aMinute: number = 60000;

  const now: number = Date.now();
  const aMinuteAgo = new Date(now - aMinute);
  const anHourAgo = new Date(now - anHour);
  const aDayAgo = new Date(now - aDay);

  const nowString = new Date();
  // eslint-disable-next-line max-len
  const aMonthAgo = new Date(Number(nowString.getFullYear()), Number(nowString.getMonth()) - 1, Number(nowString.getDate()));
  // eslint-disable-next-line max-len
  const anYearAgo = new Date(nowString.getFullYear() - 1, nowString.getMonth(), nowString.getDate());

  return (
    <ContextProvider>
      <List scroll height="70vh">
        <DMListItem
          roomInfo={{
            ...ShortMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              content: '안녕? 방금 전 보낸 메시지',
              createdAt: new Date(),
            },
            name: 'Jikang',
            status: 'ONLINE',
            unreads: 0,
          }}
        />
        <DMListItem
          roomInfo={{
            ...MediumMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              createdAt: aMinuteAgo,
              content: '안녕? 1분 전 보낸 메시지',
            },
            name: 'Ykoh',
            status: 'IN_GAME',
            unreads: 3,
          }}
        />
        <DMListItem
          roomInfo={{
            ...LongMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              createdAt: anHourAgo,
              content: '안녕? 1시간 전 보낸 메시지',
            },
            name: 'Hyochoi',
            status: 'OFFLINE',
            unreads: 6,
          }}
        />
        <DMListItem
          roomInfo={{
            ...ShortMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              createdAt: aDayAgo,
              content: '안녕? 1일 전 보낸 메시지',
            },
            name: 'Sujung',
            status: 'ONLINE',
            unreads: 9,
          }}
        />
        <DMListItem
          roomInfo={{
            ...MediumMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              createdAt: aMonthAgo,
              content: '안녕? 1달 전 보낸 메시지',
            },
            name: 'PopeKim',
            status: 'IN_GAME',
            unreads: 12,
          }}
        />
        <DMListItem
          roomInfo={{
            ...LongMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              createdAt: anYearAgo,
              content: '안녕? 1년 전 보낸 메시지 한글 글자수가 길어지면 문제가 생깁니다',
            },
            name: 'Velopert',
            status: 'OFFLINE',
            unreads: 15,
          }}
        />
        <DMListItem
          roomInfo={{
            ...ShortMessageDMRoomInfo,
            latestMessage: {
              ...ShortMessageDMRoomInfo.latestMessage,
              createdAt: new Date(2018, 9, 10),
            },
            name: 'Thanos',
            status: 'ONLINE',
            unreads: 18,
          }}
        />
        <DMListItem
          roomInfo={{
            ...MediumMessageDMRoomInfo,
            latestMessage: {
              ...MediumMessageDMRoomInfo.latestMessage,
              createdAt: new Date(2016, 9, 9),
            },
            name: 'SpiderMan',
            status: 'IN_GAME',
            unreads: 21,
          }}
        />
        <DMListItem
          roomInfo={{
            ...LongMessageDMRoomInfo,
            latestMessage: {
              ...LongMessageDMRoomInfo.latestMessage,
              createdAt: new Date(2001, 0, 8),
            },
            name: 'IronMan',
            status: 'OFFLINE',
            unreads: 24,
          }}
        />
      </List>
    </ContextProvider>
  );
};

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
