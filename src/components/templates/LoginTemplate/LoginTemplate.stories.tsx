import React from 'react';
import { Meta } from '@storybook/react';
import LoginTemplate from './LoginTemplate';
import Typo from '~components/atoms/Typo/Typo';

export default {
  component: LoginTemplate,
  title: 'templates/LoginTemplate',
} as Meta;

export const Default = () => (
  <LoginTemplate
    logo={<Typo variant="h1">Title here</Typo>}
    input={<Typo variant="h5">Input here</Typo>}
    button={<Typo variant="h5">Button here</Typo>}
  />
);
