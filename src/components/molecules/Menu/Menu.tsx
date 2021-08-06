import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink, Link, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typo from '../../atoms/Typo/Typo';
import { useAppDispatch, useUserDispatch } from '../../../utils/hooks/useContext';
import makeAPIPath from '../../../utils/utils';

const useStyles = makeStyles({
  cursor: {
    cursor: 'pointer',
  },
});

const Menu = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const classes = useStyles();

  const Choices = ['Game', 'DM', 'Channel', 'Community', 'Profile'];
  const RenderChoices = Choices.map((item) => (
    <Grid item key={item}>
      <NavLink
        activeStyle={{
          color: 'yellow',
        }}
        style={{ textDecoration: 'none', color: 'inherit' }}
        to={`/${item.toLowerCase()}`}
      >
        <Typo variant="h6">{item}</Typo>
      </NavLink>
    </Grid>
  ));

  const handleLogout = () => {
    appDispatch({ type: 'loading' });
    axios.get(makeAPIPath('/auth/logout'))
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        userDispatch({ type: 'logout' });
        history.push('/');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const menu = RenderChoices.concat(
    <Grid item key="Logout" onClick={handleLogout}>
      <Typo className={classes.cursor} variant="h6">Logout</Typo>
    </Grid>,
  );

  return (
    <AppBar>
      <Toolbar>
        <Grid container>
          <Link to="/game" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typo variant="h5">
              🏓 Pong Mighty
            </Typo>
          </Link>
        </Grid>
        <Grid container spacing={3} justifyContent="flex-end">
          {menu}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
