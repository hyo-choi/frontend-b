import React, { useCallback, useState } from 'react';
import axios from 'axios';
import strictUriEncode from 'strict-uri-encode';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import Badge from '@material-ui/core/Badge';
import Typo from '../../atoms/Typo/Typo';
import { SetDialogType, SetOpenType } from '../../../utils/hooks/useDialog';
import ListItem from '../../atoms/ListItem/ListItem';
import { ChannelType } from '../../../types/Chat';
import Button from '../../atoms/Button/Button';
import { useAppDispatch, useAppState } from '../../../utils/hooks/useAppContext';
import { makeDateString } from '../../../utils/utils';
import { useUserState } from '../../../utils/hooks/useUserContext';
import Input from '../../atoms/Input/Input';
import useError from '../../../utils/hooks/useError';

const useStyles = makeStyles({
  root: {
    padding: '0.2em',
    width: '100%',
    height: '60px',
  },
  button: {
    width: '6.5em',
  },
  badgeMargin: {
    marginLeft: '1em',
  },
  '@keyframes loading': {
    '0%': {
      backgroundColor: 'rgba(165, 165, 165, 0.1)',
    },
    '50%': {
      backgroundColor: 'rgba(165, 165, 165, 0.3)',
    },
    '100%': {
      backgroundColor: 'rgba(165, 165, 165, 0.1)',
    },
  },
  skeleton: {
    animation: '$loading 1.8s infinite ease-in-out',
  },
  skeletonIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '18px',
  },
  skeletonTypo: {
    margin: '5px',
    width: '90%',
    height: '30px',
  },
  skeletonButton: {
    margin: '0.25em',
    padding: '5px 15px',
    borderRadius: '4px',
    width: '61px',
    height: '26px',
  },
});

export const ChannelListItemSkeleton = React.memo(() => {
  const classes = useStyles();
  return (
    <ListItem>
      <Grid className={`${classes.root}`} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={5}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <div className={`${classes.skeletonIcon} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4}>
          <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
        </Grid>
      </Grid>
    </ListItem>
  );
});

type ChannelListItemProps = {
  info: ChannelType,
  setOpen: SetOpenType,
  setDialog: SetDialogType,
};

type ChannelJoinFormProps = {
  info: ChannelType,
  setOpen: SetOpenType,
};

const ChannelJoinForm = ({ info, setOpen }: ChannelJoinFormProps) => {
  const { name, isLocked } = info;
  const [password, setPassword] = useState<string>('');
  const userState = useUserState();
  const errorMessageHandler = useError();
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const history = useHistory();

  const handleJoinChannel = () => {
    appDispatch({ type: 'loading' });
    axios.post(`/channels/${strictUriEncode(name)}/members`, isLocked ? {
      memberName: userState.name, password,
    } : { memberName: userState.name })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        toast(`${name} 채널에 가입하였습니다.`);
        appDispatch({
          type: 'join',
          channels: appState.channels.concat({
            id: data.channel.id,
            name: data.channel.name,
            role: data.role,
            unreads: 0,
            isLocked: data.channel.password !== null,
            updatedAt: new Date(data.channel.updatedAt),
          }),
        });
        if (appState?.socket) appState.socket.emit('joinRoom', { id: data.channel.id });
        history.push('/channel');
      })
      .catch((error) => {
        errorMessageHandler(error);
      });
  };

  return (
    <>
      {isLocked ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            label="채널 비밀번호 입력"
            type="password"
            value={password}
            helperText="공백 제외 모든 문자+숫자 4-32자"
            autoComplete
          />
        </form>
      ) : <Typo gutterBottom>{`${name} 채널에 가입하시겠습니까?`}</Typo>}
      <Grid container justifyContent="flex-end">
        <Button variant="text" onClick={() => { setPassword(''); setOpen(false); }}>cancel</Button>
        <Button type="button" onClick={handleJoinChannel}>join</Button>
      </Grid>
    </>
  );
};

const ChannelListItem = ({
  info, setOpen, setDialog,
}: ChannelListItemProps) => {
  const {
    name, role, unreads, isLocked, updatedAt,
  } = info;
  const errorMessageHandler = useError();
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const userState = useUserState();
  const history = useHistory();
  const classes = useStyles();

  const handleExitChannel = useCallback(() => {
    appDispatch({ type: 'loading' });
    axios.delete(`/channels/${strictUriEncode(name)}/members/${userState.name}`)
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        toast(`${name} 채널에서 탈퇴하였습니다.`);
        if (appState.chatting?.name === name) appDispatch({ type: 'leaveChat' });
        appDispatch({ type: 'exit', name });
        history.push('/channel');
      })
      .catch((error) => {
        errorMessageHandler(error);
      });
  }, [info]);

  const openJoinDialog = useCallback(() => {
    setDialog({
      title: 'Join Channel',
      content: <ChannelJoinForm info={info} setOpen={setOpen} />,
      onClose: () => { setOpen(false); },
    });
    setOpen(true);
  }, [info]);

  const openLeaveDialog = useCallback(() => {
    setDialog({
      title: 'Leave Channel',
      content: role === 'OWNER'
        ? `${name} 채널에서 탈퇴하시겠습니까? 채널의 소유권은 관리자가 있는 경우 관리자에게, 없는 경우 임의의 멤버에게 양도되며, 현재 참가 인원이 1명인 경우 탈퇴 직후 채널이 삭제됩니다.`
        : `${name} 채널에서 탈퇴하시겠습니까?`,
      buttons: (
        <>
          <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
          <Button type="button" onClick={handleExitChannel}>leave</Button>
        </>),
      onClose: () => { setOpen(false); },
    });
    setOpen(true);
  }, [info]);

  const handleManage = useCallback(() => {
    history.push(`/channel/manage/${strictUriEncode(name)}`);
  }, []);

  const handleEnterChat = useCallback(() => {
    appDispatch({ type: 'enterChat', chatting: { type: 'channel', name } });
  }, []);

  const JoinButton = React.memo(() => <Button variant="outlined" onClick={openJoinDialog}>채널 가입</Button>);
  const ManageButton = React.memo(() => <Button variant="outlined" onClick={handleManage}>채널 관리</Button>);
  const GoChatButton = React.memo(() => <Button variant="outlined" onClick={handleEnterChat}>채팅 참가</Button>);
  const LeaveButton = React.memo(() => <Button variant="outlined" onClick={openLeaveDialog}>채널 탈퇴</Button>);

  const Buttons = useCallback(() => {
    switch (role) {
      case 'MEMBER':
        return (
          <>
            <GoChatButton />
            <LeaveButton />
          </>
        );
      case 'OWNER':
      case 'ADMIN':
        return (
          <>
            <ManageButton />
            <GoChatButton />
            <LeaveButton />
          </>
        );
      case 'NONE':
      default:
        return (<JoinButton />);
    }
  }, [role]);

  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="body1">{makeDateString(updatedAt)}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={5}>
          <Typo variant="h6">{name}</Typo>
          {unreads && (role !== 'NONE') ? (
            <Badge color="secondary" badgeContent={unreads} max={9} className={classes.badgeMargin} />
          ) : null}
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          { isLocked ? <LockIcon fontSize="medium" /> : undefined }
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4}>
          { Buttons() }
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default React.memo(ChannelListItem);
