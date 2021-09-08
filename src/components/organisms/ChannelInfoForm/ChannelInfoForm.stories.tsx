import React from 'react';
import { Meta } from '@storybook/react';
import ChannelInfoForm from './ChannelInfoForm';
import { ContextProvider } from '../../../utils/hooks/useContext';

export default {
  title: 'organisms/ChannelInfoForm',
  component: ChannelInfoForm,
} as Meta;

export const Default = () => (
  <ContextProvider>
    <ChannelInfoForm setOpen={() => {}} />
  </ContextProvider>
);
