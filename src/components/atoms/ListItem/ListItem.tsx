import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    width: 'calc(100%-1em)',
  },
});

type ListItemProps = { children: React.ReactNode };

const ListItem = ({ children }: ListItemProps) => {
  const classes = useStyles();
  return (
    <Grid item>
      <Card className={classes.root}>{children}</Card>
    </Grid>
  );
};

export default React.memo(ListItem);
