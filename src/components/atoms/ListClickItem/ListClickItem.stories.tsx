import React from 'react';
import { Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
import ListClickItem from './ListClickItem';
import Avatar from '../Avatar/Avatar';
import Typo from '../Typo/Typo';
import List from '../List/List';

export default {
  component: ListClickItem,
  title: 'atoms/ListClickItem',
} as Meta;

export const OneChat = () => (
  <ListClickItem onClick={() => {}}>
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
  </ListClickItem>
);

export const WithList = () => (
  <List height="30vh" scroll>
    <ListClickItem onClick={() => {}}>item</ListClickItem>
    <ListClickItem onClick={() => {}}>item</ListClickItem>
    <ListClickItem onClick={() => {}}>item</ListClickItem>
    <ListClickItem onClick={() => {}}>item</ListClickItem>
  </List>
);
