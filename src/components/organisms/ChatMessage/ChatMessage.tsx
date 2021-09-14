import React from 'react';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import SecurityRoundedIcon from '@material-ui/icons/SecurityRounded';
import { makeStyles } from '@material-ui/core/styles';
import { MembershipRole, MessageType } from '../../../types/Chat';
import Avatar from '../../atoms/Avatar/Avatar';
import Typo from '../../atoms/Typo/Typo';
import { SetDialogType, SetOpenType } from '../../../utils/hooks/useDialog';

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
  const classes = useStyles({ me });
  const handleClick = () => {
    setDialog({
      title: 'Menu',
      content: 'temp chat menu',
      onClose: () => setOpen(false),
    }); // FIXME 유저 메뉴 고쳐야 합니다
    setOpen(true);
  };

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

export default ChatMessage;
