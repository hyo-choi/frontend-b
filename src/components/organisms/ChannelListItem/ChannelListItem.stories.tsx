import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import ChannelListItem, { ChannelListItemSkeleton } from './ChannelListItem';
import List from '../../atoms/List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import { ContextProvider } from '../../../utils/hooks/useContext';

export default {
  title: 'organisms/ChannelListItem',
  component: ChannelListItem,
} as Meta;

export const Default = () => {
  const role = 'NONE';

  return (
    <ChannelListItem
      name="채팅하실분"
      role={role}
      unreads={0}
      isLocked
      updatedAt={new Date()}
    />
  );
};

export const SkeletonChannel = () => (
  <ChannelListItemSkeleton />
);

export const WithList = () => {
  const role0 = 'NONE';
  const role1 = 'MEMBER';
  const role2 = 'ADMIN';
  const role3 = 'OWNER';

  return (
    <List scroll height="70vh">
      <ChannelListItem
        name="친구들만 와라"
        isLocked
        role={role0}
        unreads={1}
        updatedAt={new Date()}
      />
      <ChannelListItem
        name="아무나 이야기 나눠요! ADMIN 어디갔냐 빨리다시들어와"
        isLocked={false}
        role={role2}
        unreads={5}
        updatedAt={new Date()}
      />
      <ChannelListItem
        name="내가 만든 비밀 채널방"
        isLocked
        role={role3}
        unreads={0}
        updatedAt={new Date()}
      />
      <ChannelListItem
        name="공개 채팅하실분 빨리 가입 고고"
        isLocked={false}
        role={role1}
        unreads={11}
        updatedAt={new Date()}
      />
      <ChannelListItem
        name="내가 만든 공개 채팅방"
        isLocked={false}
        role={role3}
        unreads={0}
        updatedAt={new Date()}
      />
      <ChannelListItem
        name="Ykoh님의 비공개채팅"
        isLocked
        role={role0}
        unreads={1}
        updatedAt={new Date()}
      />
      <ChannelListItem
        name="Ykoh님의 공개채팅"
        isLocked
        role={role0}
        unreads={1}
        updatedAt={new Date()}
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
