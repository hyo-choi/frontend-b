import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardActionArea, CardContent, Grid,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    width: 'calc(100%-1em)',
  },
  content: {
    padding: '0 0 0 0 !important',
    fontSize: 'normal',
  },
});

type ListClickItemProps = {
  onClick: React.MouseEventHandler,
  children: React.ReactNode
};

const ListClickItem = ({ onClick, children }: ListClickItemProps) => {
  const classes = useStyles();
  return (
    <Grid item>
      <CardActionArea onClick={onClick}>
        <Card className={classes.root}>
          <CardContent className={classes.content}>{children}</CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
};

export default React.memo(ListClickItem);
