import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { NavLink, Link } from 'react-router-dom';
import Typo from '../../atoms/Typo/Typo';

const Menu = () => {
  const Choices = ['Game', 'DM', 'Channel', 'Community', 'Profile', 'Logout'];
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
          {RenderChoices}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
