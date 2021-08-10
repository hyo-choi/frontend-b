import React from 'react';
import { Meta } from '@storybook/react';
import Avatar from './Avatar';

export default {
  component: Avatar,
  title: 'atoms/Avatar',
} as Meta;

export const Avatars = () => (
  <>
    <Avatar alt="Name" />
    <Avatar
      alt="jikang"
      src="https://cdn.intra.42.fr/users/medium_jikang.jpg"
    />
    <Avatar
      alt="Travis"
      src="https://material-ui.com/static/images/avatar/2.jpg"
    />
  </>
);
