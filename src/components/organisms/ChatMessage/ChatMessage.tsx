import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import SecurityRoundedIcon from '@material-ui/icons/SecurityRounded';
import { makeStyles } from '@material-ui/core/styles';
import { MembershipRole, MessageType } from '../../../types/Chat';
import Avatar from '../../atoms/Avatar/Avatar';
import Typo from '../../atoms/Typo/Typo';
import { SetDialogType, SetOpenType } from '../../../utils/hooks/useDialog';
import Button from '../../atoms/Button/Button';
import { makeMatchHistoryString } from '../../../utils/utils';
import useMatch from '../../../utils/hooks/useMatch';
import { PLAY_PATH } from '../../../utils/path';

type StyleProps = { me: boolean };

const useStyles = makeStyles({
  chat: {
    marginBottom: ({ me }: StyleProps) => (me ? '1em' : ''),
  },
  message: {
    wordBreak: 'break-all',
    maxWidth: '70%',
    padding: '10px',
    boxShadow: '0px 0px 5px lightgray',
    backgroundColor: ({ me }: StyleProps) => (me ? 'gray' : 'white'),
    color: ({ me }: StyleProps) => (me ? 'white' : 'black'),
    borderRadius: ({ me }: StyleProps) => (me ? '15px 15px 0 15px' : '15px 15px 15px 0'),
  },
  date: {
    color: '#bbb',
  },
  name: {
    margin: '8px 0 0 3px',
  },
  avatar: {
    margin: '0 8px 0 0 !important',
  },
});

type ChatProps = {
  info: MessageType,
  userRole: MembershipRole,
  me?: boolean,
  setOpen: SetOpenType,
  setDialog: SetDialogType,
};

const makeDateString = (date: Date) => {
  const now = new Date();
  const today = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
  const messageDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  if (today === messageDate) return `${date.getHours()}:${date.getMinutes()}`;
  return `${messageDate} ${date.getHours()}:${date.getMinutes()}`;
};

const ChatMessage = ({
  info, userRole, me = false, setOpen, setDialog,
}: ChatProps) => {
  const { user } = info;
  const {
    id, name, avatar, score, win, lose,
  } = user;
  const { inviteUser } = useMatch(setOpen, setDialog);
  const classes = useStyles({ me });
  const history = useHistory();
  const location = useLocation();

  const handleMatchChoice = useCallback(() => {
    setDialog({
      title: '매치 초대',
      content: (
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Typo gutterBottom>초대할 게임 모드를 선택해주세요.</Typo>
          <Grid item container justifyContent="center" alignItems="center">
            <Button variant="outlined" onClick={() => inviteUser('CLASSIC', id)}>CLASSIC</Button>
            <Button variant="outlined" onClick={() => inviteUser('SPEED', id)}>SPEED</Button>
            <Button variant="outlined" onClick={() => inviteUser('REVERSE', id)}>REVERSE</Button>
          </Grid>
        </Grid>),
      buttons: <Button variant="text" onClick={() => { setOpen(false); }}>close</Button>,
      onClose: () => setOpen(false),
    });
    setOpen(true);
  }, [info]);

  const handleProfileClick = useCallback(() => {
    history.push(`/profile/${name}`);
    setOpen(false);
  }, [info]);

  const handleClick = useCallback(() => {
    setDialog({
      content: (
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Avatar size="large" alt={name} src={avatar} />
          <Typo variant="h5">{name}</Typo>
          <Typo variant="body2" gutterBottom>
            {makeMatchHistoryString(score!, win!, lose!)}
          </Typo>
          <Button variant="outlined" onClick={handleProfileClick}>프로필 페이지</Button>
          {location.pathname !== PLAY_PATH && <Button variant="outlined" onClick={handleMatchChoice}>매치 초대하기</Button>}
        </Grid>
      ),
      buttons: <Button variant="text" onClick={() => { setOpen(false); }}>close</Button>,
      onClose: () => setOpen(false),
    });
    setOpen(true);
  }, [info, location.pathname]);

  return (
    <Grid
      item
      container
      className={classes.chat}
      direction="column"
      alignItems={me ? 'flex-end' : 'flex-start'}
      justifyContent="flex-end"
    >
      <Grid item container justifyContent={me ? 'flex-end' : 'flex-start'} alignItems="flex-end">
        {!me && (
        <Badge
          style={{ marginBottom: '0' }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          overlap="circular"
          badgeContent={['ADMIN', 'OWNER'].includes(userRole) ? (
            <SecurityRoundedIcon
              color={userRole === 'OWNER' ? 'secondary' : 'primary'}
              fontSize="small"
            />
          ) : <></>}
        >
          <Avatar
            onClick={handleClick}
            className={classes.avatar}
            src={user.avatar}
            alt={user.name}
          />
        </Badge>
        )}
        <div className={classes.message}>
          <Typo>{info.content}</Typo>
          <Typo className={classes.date} align={me ? 'left' : 'right'} variant="subtitle2">
            {makeDateString(info.createdAt)}
          </Typo>
        </div>
      </Grid>
      <Grid item container justifyContent={me ? 'flex-end' : 'space-between'}>
        {!me && <Typo className={classes.name} variant="body2">{user.name}</Typo>}
      </Grid>
    </Grid>
  );
};

ChatMessage.defaultProps = {
  me: false,
};

export default React.memo(ChatMessage);
