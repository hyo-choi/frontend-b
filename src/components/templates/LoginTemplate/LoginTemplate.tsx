import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: '5em 0',
  },
});

type LoginTemplateProps = {
  logo?: React.ReactNode,
  input?: React.ReactNode,
  button: React.ReactNode,
};

const LoginTemplate = ({
  logo, input, button,
}: LoginTemplateProps) => {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        container
        className={classes.root}
        direction="column"
        justifyContent="flex-start"
        xs={6}
        spacing={3}
      >
        <Grid item container justifyContent="center">{logo}</Grid>
        <Grid item container justifyContent="center">{input}</Grid>
        <Grid item container justifyContent="center">{button}</Grid>
      </Grid>
    </Grid>
  );
};

LoginTemplate.defaultProps = {
  logo: null,
  input: null,
};

export default LoginTemplate;
