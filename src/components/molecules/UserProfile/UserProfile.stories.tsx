import React from 'react';
import { Meta, Story } from '@storybook/react';
import { UserInfoType } from '../../../types/User';
import UserProfile from './UserProfile';

export default {
  title: 'molecules/UserProfile',
  component: UserProfile,
} as Meta;

export const Default: Story<UserInfoType> = ({ status }: UserInfoType) => {
  const userInfo: UserInfoType = {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'USERNAME',
    avatar: '',
    status,
  };

  return <UserProfile userInfo={userInfo} />;
};

Default.args = {
  status: 'ONLINE',
};
