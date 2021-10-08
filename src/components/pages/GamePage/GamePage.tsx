import React, { useEffect, useRef } from 'react';
import {
  Route, Switch, useHistory, Redirect,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import GameOptionCard from '../../molecules/GameOptionCard/GameOptionCard';
import GameWatchPage from '../GameWatchPage/GameWatchPage';
import { useAppState } from '../../../utils/hooks/useAppContext';
import useDialog from '../../../utils/hooks/useDialog';
import Button from '../../atoms/Button/Button';
import Dialog from '../../molecules/Dialog/Dialog';
import Typo from '../../atoms/Typo/Typo';
import GamePlayPage from '../GamePlayPage/GamePlayPage';
import { useGameDispatch, useGameState } from '../../../utils/hooks/useGameContext';
import useMatch from '../../../utils/hooks/useMatch';
import { GameModeType, ReadyEventType } from '../../../types/Match';
import { MAIN_GAME_PAGE, PLAY_PATH, WATCH_PATH } from '../../../utils/path';

const useStyles = makeStyles({
  root: {
    height: '78vh',
    margin: '0.5em auto',
    backgroundColor: '#eee',
    borderRadius: '10px',
    padding: '5px',
  },
  progress: {
    margin: '1em',
  },
});

const GameMainPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const { mode } = useGameState();
  const modeRef = useRef<GameModeType | null>(null);
  const gameDispatch = useGameDispatch();
  const { socket } = useAppState();
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const { handleReady, handleExit } = useMatch(setOpen, setDialog);

  const handleDuplicated = () => {
    toast.warn('자신과 매칭되어 대기를 취소합니다.');
    gameDispatch({ type: 'reset' });
    modeRef.current = null;
    setOpen(false);
  };

  const handleMatchExit = (gameMode: GameModeType | null) => {
    if (gameMode) {
      socket?.emit('leaveGame', { mode: gameMode });
      setOpen(false);
    }
    modeRef.current = null;
  };

  const handleExitWithRef = (gameMode: GameModeType | null) => {
    modeRef.current = null;
    handleExit(gameMode);
  };

  const handleReadyWithRef = (data: ReadyEventType) => {
    modeRef.current = null;
    handleReady(data);
  };

  const changeMode = (gameMode: GameModeType) => {
    gameDispatch({
      type: 'setGame',
      gameType: 'LADDER',
      mode: gameMode,
      isPlayer: true,
    });
    modeRef.current = gameMode;
    setDialog({
      ...dialog,
      title: `${gameMode} MODE matching...`,
      buttons: <Button onClick={() => handleExitWithRef(gameMode)}>매칭 취소</Button>,
      onClose: () => handleExitWithRef(gameMode),
    });
    socket?.on('ready', handleReadyWithRef);
    socket?.on('duplicated', handleDuplicated);
    setOpen(true);
    socket?.emit('waiting', { mode: gameMode });
  };

  useEffect(() => {
    if (mode) handleExit(mode);
    modeRef.current = null;

    socket?.on('invitedToMatch', handleMatchExit);

    setDialog({
      title: 'default',
      content: (
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <CircularProgress size={100} className={classes.progress} aria-busy />
          <Typo variant="subtitle1" align="center">매칭 가능한 유저를 찾는 중입니다</Typo>
        </Grid>
      ),
      buttons: <Button onClick={() => handleExitWithRef(mode)}>매칭 취소</Button>,
      onClose: () => handleExitWithRef(mode),
    });

    return () => {
      if (socket?.listeners('ready').length && modeRef.current) {
        socket?.emit('leaveGame', { mode: modeRef.current });
      }
      modeRef.current = null;
      socket?.off('invitedToMatch', handleMatchExit);
      socket?.off('ready');
      socket?.off('duplicated');
      setOpen(false);
    };
  }, []);

  return (
    <Grid className={classes.root} container justifyContent="space-evenly" alignItems="center" spacing={3}>
      <Dialog
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        isOpen={isOpen}
        onClose={dialog.onClose}
      />
      <Grid item xs={6}>
        <GameOptionCard option="CLASSIC" onClick={() => changeMode('CLASSIC')} />
      </Grid>
      <Grid item xs={6}>
        <GameOptionCard option="SPEED" onClick={() => changeMode('SPEED')} />
      </Grid>
      <Grid item xs={6}>
        <GameOptionCard option="REVERSE" onClick={() => changeMode('REVERSE')} />
      </Grid>
      <Grid item xs={6}>
        <GameOptionCard option="WATCH" onClick={() => { history.push(WATCH_PATH); }} />
      </Grid>
    </Grid>
  );
};

const GamePage = () => (
  <Switch>
    <Route exact path={MAIN_GAME_PAGE} component={GameMainPage} />
    <Route exact path={PLAY_PATH} component={GamePlayPage} />
    <Route path={WATCH_PATH} component={GameWatchPage} />
    <Route exact path="/">
      <Redirect to={MAIN_GAME_PAGE} />
    </Route>
  </Switch>
);

export default GamePage;
