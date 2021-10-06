import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RelatedInfoType } from '../../../types/User';
import UserProfile from './UserProfile';

export default {
  title: 'molecules/UserProfile',
  component: UserProfile,
} as Meta;

export const Default: Story<RelatedInfoType> = ({ status }: RelatedInfoType) => {
  const userInfo: RelatedInfoType = {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'USERNAME',
    avatar: '',
    status,
    relationship: 'NONE',
    score: 0,
    win: 0,
    lose: 0,
  };

  return <UserProfile profile userInfo={userInfo} />;
};

Default.args = {
  status: 'ONLINE',
};
