import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import CanvasManager, { RectangleType } from '../../../utils/game/CanvasManager';
import { useAppState } from '../../../utils/hooks/useAppContext';
import useDialog from '../../../utils/hooks/useDialog';
import { useGameDispatch, useGameState } from '../../../utils/hooks/useGameContext';
import Button from '../../atoms/Button/Button';
import Typo from '../../atoms/Typo/Typo';
import Dialog from '../../molecules/Dialog/Dialog';
import PlayerProfile from '../../organisms/PlayerProfile/PlayerProfile';

type StyleProps = { width: number };

const useStyles = makeStyles({
  root: {
    width: ({ width }: StyleProps) => width || '100%',
  },
});

type PlayStateType = 'init' | 'ready' | 'playing' | 'end';

type PlayerStateType = {
  score: number,
  ready: boolean,
};

const initialPlayerState = { score: 0, ready: false };

const makeCountString = (count: number, state: PlayStateType): string => {
  switch (state) {
    case 'init':
      if (count > 0) return `${count}초 안에 ready 버튼을 누르세요.`;
      return '준비 가능 시간을 초과하였습니다.';
    case 'ready':
      return '상대 플레이어가 준비되기를 기다리고 있습니다.';
    case 'playing':
      if (count > 0) return `게임 시작까지 ${count}초`;
      return 'GAME START!';
    case 'end':
    default:
      return 'GAME END';
  }
};

const GamePlayPage = () => {
  const { socket } = useAppState();
  const history = useHistory();
  const {
    mode, setting, player0, player1, position, isPlayer, gameType,
  } = useGameState();
  const gameDispatch = useGameDispatch();
  const [state, setState] = useState<PlayStateType>('init');
  const [countdown, setCountDown] = useState<number | null>(null);
  const [playerState, setPlayerState] = useState<
    PlayerStateType[]>([initialPlayerState, initialPlayerState]);
  const canvas = React.createRef<HTMLCanvasElement>();
  const canvasManager = useRef<CanvasManager>();
  const classes = useStyles(setting?.WIDTH);
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
      socket?.emit('keydown', e.code === 'ArrowUp' ? 38 : 40);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
      socket?.emit('keyup', e.code === 'ArrowUp' ? 38 : 40);
    }
  };

  const handleExit = () => {
    socket?.emit('leaveGame', { type: gameType, mode });
    if (isPlayer) setState('end');
    else history.replace('/');
  };

  useEffect(() => {
    if (!setting || !position || !mode) {
      toast.error('잘못된 접근입니다.');
      history.replace('/');
    }
    if (isPlayer) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    } else setState('playing');

    if (canvas.current) canvasManager.current = new CanvasManager(canvas.current.getContext('2d')!, setting);

    socket?.on('playing', () => setState('playing'));

    socket?.on('update', (data) => {
      canvasManager.current?.drawBackground();
      canvasManager.current?.drawNet();
      canvasManager.current?.drawBorder();
      canvasManager.current?.drawRect(data.ball as RectangleType);
      canvasManager.current?.drawRect(data.player0 as RectangleType);
      canvasManager.current?.drawRect(data.player1 as RectangleType);
      setCountDown(data.countdown?.left || null);
      setPlayerState([
        { score: data.player0.score, ready: data.player0.ready },
        { score: data.player1.score, ready: data.player1.ready },
      ]);
    });

    socket?.on('destroy', (message) => {
      const handleClose = () => {
        gameDispatch({ type: 'reset' });
        history.replace('/');
      };
      if (isPlayer) {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      }
      setState('end');
      setDialog({
        content: message || '게임이 종료되었습니다.',
        buttons: <Button onClick={handleClose}>Exit</Button>,
        onClose: handleClose,
      });
      setOpen(true);
    });

    return () => {
      if (mode) socket?.emit('leaveGame', { type: gameType, mode });
      setOpen(false);
      gameDispatch({ type: 'reset' });
      socket?.off('update');
      socket?.off('destroy');
      if (isPlayer) {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, []);

  return setting ? (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <Grid container className={classes.root} direction="column" justifyContent="center" alignItems="center">
        <Typo variant="h6">{makeCountString(countdown || 0, [playerState[0].score, playerState[1].score].includes(5) ? 'end' : state)}</Typo>
        <Grid item container justifyContent="center" alignItems="center">
          <Grid item xs={5}><Typo variant="h5" align="center">{playerState[0].score}</Typo></Grid>
          <Grid item xs={2}><Typo variant="h6" align="center">SCORE</Typo></Grid>
          <Grid item xs={5}><Typo variant="h5" align="center">{playerState[1].score}</Typo></Grid>
        </Grid>
        <canvas width={setting.WIDTH} height={setting.HEIGHT} ref={canvas} />
        <Grid item container direction="row" className={classes.root} justifyContent="space-around" alignItems="center">
          <Grid item xs={4} container justifyContent="flex-end">
            <PlayerProfile userGameInfo={player0!} />
          </Grid>
          <Grid item container xs={4} direction="column" justifyContent="center" alignItems="center">
            <Typo variant="h6">{mode}</Typo>
            <Grid item container justifyContent="center" alignItems="center">
              {isPlayer && <Button onClick={() => { if (socket?.emit('ready')) setState('ready'); }} disabled={state !== 'init'}>ready</Button>}
              <Button onClick={handleExit}>exit</Button>
            </Grid>
          </Grid>
          <Grid item xs={4} container justifyContent="flex-start">
            <PlayerProfile userGameInfo={player1!} />
          </Grid>
        </Grid>
      </Grid>
    </>
  ) : (
    <Grid container justifyContent="center" alignItems="center">
      <Typo>문제가 발생했습니다.</Typo>
    </Grid>
  );
};

export default GamePlayPage;
