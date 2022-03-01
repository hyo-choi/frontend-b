import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import UserInfoForm from './UserInfoForm';
import ContextProvider from '~hooks/useContext';

export default {
  component: UserInfoForm,
  title: 'organisms/UserInfoForm',
} as Meta;

export const Default = () => (
  <BrowserRouter>
    <ContextProvider>
      <Grid container justifyContent="center">
        <Grid
          item
          container
          xs={3}
          direction="column"
          justifyContent="space-evenly"
          spacing={3}
        >
          <UserInfoForm
            currentName=""
            currentAvatarSrc=""
            current2FA={false}
            setOpen={() => {}}
            setDialog={() => {}}
          />
        </Grid>
      </Grid>
    </ContextProvider>
  </BrowserRouter>
);

export const ExistingUser = () => (
  <BrowserRouter>
    <ContextProvider>
      <Grid container justifyContent="center">
        <Grid
          item
          container
          xs={3}
          direction="column"
          justifyContent="space-evenly"
          spacing={3}
        >
          <UserInfoForm
            currentName="jikang"
            currentAvatarSrc="https://cdn.intra.42.fr/users/medium_jikang.jpg"
            current2FA
            setOpen={() => {}}
            setDialog={() => {}}
          />
        </Grid>
      </Grid>
    </ContextProvider>
  </BrowserRouter>
);
