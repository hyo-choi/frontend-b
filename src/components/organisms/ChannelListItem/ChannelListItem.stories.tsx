import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import ChannelListItem, { ChannelListItemSkeleton } from './ChannelListItem';
import { ChannelType } from '../../../types/Chat';
import List from '../../atoms/List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import ContextProvider from '../../../utils/hooks/useContext';

export default {
  title: 'organisms/ChannelListItem',
  component: ChannelListItem,
} as Meta;

export const Default = () => {
  const channelInfo0: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '채팅 할 사람~',
    role: 'NONE',
    unreads: 0,
    isLocked: true,
    updatedAt: new Date(),
  };

  return (
    <ChannelListItem
      info={channelInfo0}
      setOpen={() => {}}
      setDialog={() => {}}
    />
  );
};

export const SkeletonChannel = () => (
  <ChannelListItemSkeleton />
);

export const WithList = () => {
  const channelInfo1: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '내가 만든 공개방',
    role: 'OWNER',
    unreads: 10,
    isLocked: false,
    updatedAt: new Date(),
  };

  const channelInfo2: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '내가 ADMIN인 공개방',
    role: 'ADMIN',
    unreads: 5,
    isLocked: false,
    updatedAt: new Date(),
  };

  const channelInfo3: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '내가 만든 비공개방',
    role: 'OWNER',
    unreads: 42,
    isLocked: true,
    updatedAt: new Date(),
  };

  const channelInfo4: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '내가 ADMIN인 비공개방',
    role: 'ADMIN',
    unreads: 2,
    isLocked: true,
    updatedAt: new Date(),
  };

  const channelInfo5: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '내가 멤버인 공개방',
    role: 'MEMBER',
    unreads: 0,
    isLocked: false,
    updatedAt: new Date(),
  };

  const channelInfo6: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '내가 멤버인 비공개방',
    role: 'MEMBER',
    unreads: 10,
    isLocked: true,
    updatedAt: new Date(),
  };

  const channelInfo7: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '아직 join이 안된 공개방',
    role: 'NONE',
    unreads: 0,
    isLocked: false,
    updatedAt: new Date(),
  };

  const channelInfo8: ChannelType = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '아직 join이 안된 비공개방',
    role: 'NONE',
    unreads: 0,
    isLocked: true,
    updatedAt: new Date(),
  };

  return (
    <List scroll height="70vh">
      <ChannelListItem
        info={channelInfo1}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo2}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo3}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo4}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo5}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo6}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo7}
        setOpen={() => {}}
        setDialog={() => {}}
      />
      <ChannelListItem
        info={channelInfo8}
        setOpen={() => {}}
        setDialog={() => {}}
      />
    </List>
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
