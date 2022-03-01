import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Badge, makeStyles, Toolbar, Grid, AppBar,
} from '@material-ui/core';
import { Typo } from '~components/index';
import useLogout from '~hooks/useLogout';
import { useAppState } from '~hooks/useAppContext';
import { getUnreads } from '~utils/index';

const useStyles = makeStyles({
  cursor: {
    cursor: 'pointer',
  },
  root: {
    paddingRight: '0 !important',
  },
});

const Menu = () => {
  const classes = useStyles();
  const handleLogout = useLogout();
  const { channels, DMs } = useAppState();

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
        {['Channel', 'DM'].includes(item) ? (
          <Badge max={9} badgeContent={item === 'DM' ? getUnreads(DMs) : getUnreads(channels)} color="secondary">
            <Typo variant="h6">{item}</Typo>
          </Badge>
        ) : <Typo variant="h6">{item}</Typo>}
      </NavLink>
    </Grid>
  ));

  const menu = RenderChoices.concat(
    <Grid item key="Logout" onClick={handleLogout}>
      <Typo className={classes.cursor} variant="h6">Logout</Typo>
    </Grid>,
  );

  return (
    <AppBar className={classes.root}>
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

export default React.memo(Menu);
