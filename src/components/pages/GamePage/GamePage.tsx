import React from 'react';
import {
  Route, Switch, useHistory, Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GameOptionCard from '../../molecules/GameOptionCard/GameOptionCard';

const MAIN_GAME_PAGE = '/game';
const CLASSIC_PLAY_PATH = '/game/playclassic';
const SPEED_PLAY_PATH = '/game/playspeed';
const REVERSE_PLAY_PATH = '/game/playreverse';
const WATCH_PLAY_PATH = '/game/watch';

const useStyles = makeStyles({
  root: {
    height: '78vh',
    margin: '0.5em auto',
    backgroundColor: '#eee',
    borderRadius: '10px',
    padding: '5px',
  },
});

const GameMainPage = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Grid className={classes.root} container justifyContent="space-evenly" alignItems="center" spacing={3}>
      <Grid item xs={6}>
        <GameOptionCard option="classic" onClick={() => { history.push(CLASSIC_PLAY_PATH); }} />
      </Grid>
      <Grid item xs={6}>
        <GameOptionCard option="speed" onClick={() => { history.push(SPEED_PLAY_PATH); }} />
      </Grid>
      <Grid item xs={6}>
        <GameOptionCard option="reverse" onClick={() => { history.push(REVERSE_PLAY_PATH); }} />
      </Grid>
      <Grid item xs={6}>
        <GameOptionCard option="watch" onClick={() => { history.push(WATCH_PLAY_PATH); }} />
      </Grid>
    </Grid>
  );
};

const GamePage = () => (
  <>
    <Switch>
      <Route exact path={MAIN_GAME_PAGE} component={GameMainPage} />
      <Route exact path={CLASSIC_PLAY_PATH} render={() => <h1>Classic play</h1>} />
      <Route exact path={SPEED_PLAY_PATH} render={() => <h1>Speedy play</h1>} />
      <Route exact path={REVERSE_PLAY_PATH} render={() => <h1>Reverse play</h1>} />
      <Route exact path={WATCH_PLAY_PATH} render={() => <h1>Watch play</h1>} />
      <Route path="/">
        <Redirect to={MAIN_GAME_PAGE} />
      </Route>
    </Switch>
  </>
);

export default GamePage;
