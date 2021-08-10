import React from 'react';
import { Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
import { BrowserRouter } from 'react-router-dom';
import ListItem from './ListItem';
import Avatar from '../Avatar/Avatar';
import Typo from '../Typo/Typo';
import Button from '../Button/Button';
import List from '../List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import { ContextProvider } from '../../../utils/hooks/useContext';

export default {
  component: ListItem,
  title: 'atoms/ListItem',
} as Meta;

export const FriendList = () => (
  <ListItem>
    <Grid container spacing={1} justifyContent="center" alignItems="center">
      <Grid item container xs={2} justifyContent="flex-end" alignItems="center">
        <Avatar alt="Jikang" />
      </Grid>
      <Grid item container direction="column" xs={8} justifyContent="center" alignItems="flex-start">
        <Typo variant="subtitle1">Jikang</Typo>
        <Typo variant="caption">메시지 차단</Typo>
      </Grid>
      <Grid item container xs={2} justifyContent="flex-start" alignItems="center">
        <Button>차단</Button>
      </Grid>
    </Grid>
  </ListItem>
);

export const OneChat = () => (
  <ListItem>
    <Grid container spacing={1} alignItems="center">
      <Grid item container xs={2} justifyContent="flex-end" alignItems="center">
        <Avatar alt="Jikang" />
      </Grid>
      <Grid item xs={10}>
        <Typo>
          Jikang :  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Typo>
      </Grid>
    </Grid>
  </ListItem>
);

export const WithList = () => (
  <List height="30vh" scroll>
    <ListItem>item</ListItem>
    <ListItem>item</ListItem>
    <ListItem>item</ListItem>
    <ListItem>item</ListItem>
  </List>
);

export const WithMainTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={(
          <List height="80vh">
            <FriendList />
            <FriendList />
            <FriendList />
          </List>
      )}
        chat={(
          <List height="80vh" scroll>
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
          </List>
      )}
      />
    </ContextProvider>
  </BrowserRouter>
);
