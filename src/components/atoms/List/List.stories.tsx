import React from 'react';
import { Meta } from '@storybook/react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import List from './List';

export default {
  component: List,
  title: 'atoms/List',
} as Meta;

const StyledCard = withStyles({
  root: {
    height: '50px',
  },
})(Card);

export const EmptyList = () => <List />;

export const WithItems = () => (
  <List height="30vh">
    <Grid item><StyledCard>no scroll</StyledCard></Grid>
    <Grid item><StyledCard>no scroll</StyledCard></Grid>
  </List>
);

export const WithManyItems = () => (
  <List height="50vh" scroll>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
    <Grid item><StyledCard>scroll</StyledCard></Grid>
  </List>
);
