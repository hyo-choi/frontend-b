import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import ChannelUserListItem, { ChannelUserListItemSkeleton } from './ChannelUserListItem';
import List from '../../atoms/List/List';
import { MemberType } from '../../../types/Chat';
import ContextProvider from '../../../utils/hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';

export default {
  title: 'organisms/ChannelUserListItem',
  component: ChannelUserListItem,
} as Meta;

const dummyUserListItem: MemberType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'USERNAME',
  avatar: '',
  status: 'ONLINE',
  memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: null }],
};

export const Default = () => (
  <ContextProvider>
    <ChannelUserListItem
      info={dummyUserListItem}
      myRole="OWNER"
      setUser={() => {}}
      setOpen={() => {}}
      setDialog={() => {}}
      channelName="dummy"
    />
  </ContextProvider>
);

export const SkeletonChannel = () => <ChannelUserListItemSkeleton />;

const IamOwnerWithList = () => (
  <ContextProvider>
    <List scroll height="70vh">
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'MutedMember',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'BannedMember',
          status: 'IN_GAME',
          memberships: [{ role: 'BANNED', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember',
          status: 'OFFLINE',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'I am Admin',
          memberships: [{ role: 'ADMIN', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember1',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember2',
          status: 'IN_GAME',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember3',
          status: 'OFFLINE',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="OWNER"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
    </List>
  </ContextProvider>
);

const IamAdminWithList = () => (
  <ContextProvider>
    <List scroll height="70vh">
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'MutedMember',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'BannedMember',
          status: 'IN_GAME',
          memberships: [{ role: 'BANNED', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember0',
          status: 'OFFLINE',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'I am OWNER',
          memberships: [{ role: 'OWNER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember1',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember2',
          status: 'IN_GAME',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
      <ChannelUserListItem
        info={{
          ...dummyUserListItem,
          name: 'generalMember3',
          status: 'OFFLINE',
          memberships: [{ role: 'MEMBER', createdAt: (new Date()).toString(), unmutedAt: (new Date()).toString() }],
        }}
        myRole="ADMIN"
        setUser={() => {}}
        setOpen={() => {}}
        setDialog={() => {}}
        channelName="dummy"
      />
    </List>
  </ContextProvider>
);

export const IamOwnerWithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<IamOwnerWithList />}
        chat={<h1>Chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);

export const IamAdminWithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<IamAdminWithList />}
        chat={<h1>Chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);
