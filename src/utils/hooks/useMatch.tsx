import React, { useRef } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typo from '../../components/atoms/Typo/Typo';
import Button from '../../components/atoms/Button/Button';
import { useAppState } from './useAppContext';
import { useGameDispatch } from './useGameContext';
import { RawUserInfoType } from '../../types/Response';
import { MatchPositionType, GameModeType } from '../../types/Match';
import { makeAPIPath } from '../utils';
import { SetOpenType, SetDialogType } from './useDialog';
import { PLAY_PATH } from '../path';

const useStyles = makeStyles({
  progress: {
    margin: '1em',
  },
});

const offListeners = (socket: Socket | null) => {
  socket?.off('ready');
  socket?.off('duplicated');
  socket?.off('declined');
  socket?.off('canceled');
};

const useMatch = (setOpen: SetOpenType, setDialog: SetDialogType) => {
  const { socket } = useAppState();
  const invitedId = useRef<string>('');
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameDispatch = useGameDispatch();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const handleReady = (
    position: MatchPositionType,
    player0: RawUserInfoType,
    player1: RawUserInfoType,
    gameSetting: any,
  ) => {
    clearTimeout(timerId.current as unknown as number || undefined);
    timerId.current = null;
    offListeners(socket);
    gameDispatch({
      type: 'ready',
      position,
      player0: { ...player0, avatar: makeAPIPath(`/${player0.avatar}`) },
      player1: { ...player1, avatar: makeAPIPath(`/${player1.avatar}`) },
      setting: gameSetting,
    });
    setOpen(false);
    history.push(PLAY_PATH);
  };

  const handleExit = (mode: GameModeType | null) => {
    offListeners(socket);
    socket?.emit('leaveGame', { type: 'LADDER', mode });
    gameDispatch({ type: 'reset' });
    setOpen(false);
  };

  const handleDeclined = ({ message }: { message: string }) => {
    clearTimeout(timerId.current as unknown as number || undefined);
    timerId.current = null;
    offListeners(socket);
    toast.warn(message);
    if (location.pathname !== PLAY_PATH) gameDispatch({ type: 'reset' });
    setOpen(false);
  };

  const handleCancel = (opponentUserId: string) => {
    clearTimeout(timerId.current as unknown as number || undefined);
    timerId.current = null;
    offListeners(socket);
    socket?.emit('cancelMatchInvitation', { opponentUserId });
    if (location.pathname !== PLAY_PATH) gameDispatch({ type: 'reset' });
    setOpen(false);
  };

  const inviteUser = (mode: GameModeType, opponentUserId: string) => {
    setDialog({
      title: '매치 초대 수락 대기 중',
      content: (
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <CircularProgress size={100} className={classes.progress} aria-busy />
          <Typo variant="subtitle1" align="center">매치 초대 후 수락 대기중입니다.</Typo>
        </Grid>
      ),
      buttons: <Button onClick={() => handleCancel(opponentUserId)}>초대 취소</Button>,
      onClose: () => handleCancel(opponentUserId),
    });
    socket?.emit('inviteMatch', { mode, opponentUserId });
    timerId.current = setTimeout(() => {
      handleCancel(opponentUserId);
      toast.warn('초대 대기 시간이 1분을 초과하여 자동 취소되었습니다.');
    }, 60000);
    socket?.on('ready', (position, player0, player1, gameSetting) => {
      gameDispatch({
        type: 'setGame',
        gameType: 'EXHIBITION',
        mode,
        isPlayer: true,
      });
      handleReady(position, player0, player1, gameSetting);
    });
    socket?.on('declined', handleDeclined);
  };

  const handleAccept = (mode: GameModeType, opponentSocketId: string, currentSocket: Socket) => {
    gameDispatch({
      type: 'setGame',
      gameType: 'EXHIBITION',
      mode,
      isPlayer: true,
    });
    invitedId.current = '';
    currentSocket?.on('ready', handleReady);
    currentSocket?.emit('acceptMatch', { mode, opponentSocketId });
  };

  const handleDecline = (opponentSocketId: string, currentSocket: Socket) => {
    invitedId.current = '';
    gameDispatch({ type: 'reset' });
    currentSocket?.emit('declineMatch', { opponentSocketId });
    currentSocket?.off('canceled');
    setOpen(false);
  };

  const handleCanceled = ({ message }: { message: string }) => {
    invitedId.current = '';
    toast.warn(message);
    gameDispatch({ type: 'reset' });
    offListeners(socket);
    setOpen(false);
  };

  const handleInvited = (
    mode: GameModeType, opponent: RawUserInfoType, opponentSocketId: string, currentSocket: Socket,
  ) => {
    const { name } = opponent;

    if (invitedId.current?.length) handleDecline(invitedId.current, currentSocket);
    invitedId.current = opponentSocketId;

    currentSocket?.on('canceled', handleCanceled);
    setDialog({
      title: '매치 초대 알림',
      content: `${name}님으로부터 ${mode} 매치 초대가 도착하였습니다.
      수락하시겠습니까?`,
      buttons: (
        <>
          <Button onClick={() => handleAccept(mode, opponentSocketId, currentSocket)}>
            confirm
          </Button>
          <Button variant="outlined" onClick={() => handleDecline(opponentSocketId, currentSocket)}>
            decline
          </Button>
        </>
      ),
      onClose: () => handleDecline(opponentSocketId, currentSocket),
    });
    setOpen(true);
  };

  return {
    handleReady, handleExit, inviteUser, handleInvited,
  };
};

export default useMatch;
