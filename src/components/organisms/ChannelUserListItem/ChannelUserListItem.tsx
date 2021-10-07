import React, { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import SecurityRoundedIcon from '@material-ui/icons/SecurityRounded';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import { useUserState } from '../../../utils/hooks/useUserContext';
import ListItem from '../../atoms/ListItem/ListItem';
import Typo from '../../atoms/Typo/Typo';
import Avatar from '../../atoms/Avatar/Avatar';
import { MembershipRole, MemberType } from '../../../types/Chat';
import { UserStatusType } from '../../../types/User';
import Button from '../../atoms/Button/Button';
import { SetDialogType, SetOpenType } from '../../../utils/hooks/useDialog';
import { useAppDispatch } from '../../../utils/hooks/useAppContext';
import useError from '../../../utils/hooks/useError';

type StyleProps = {
  status: UserStatusType,
  role: MembershipRole,
};

const useStyles = makeStyles({
  root: {
    padding: '0.2em',
    width: '100%',
    height: '65px',
  },
  status: {
    color: (props: StyleProps) => {
      switch (props.status) {
        case 'ONLINE':
          return 'lightgreen';
        case 'OFFLINE':
          return 'gray';
        case 'IN_GAME':
          return 'blue';
        default:
          return 'black';
      }
    },
  },
  role: {
    color: (props: StyleProps) => {
      switch (props.role) {
        case 'OWNER':
          return 'red';
        case 'ADMIN':
          return 'blue';
        case 'BANNED':
          return 'gray';
        case 'MEMBER':
        case 'NONE':
        default:
          return 'black';
      }
    },
  },
});

const useSkeletonStyles = makeStyles({
  root: {
    padding: '0.2em',
    width: '100%',
    height: '65px',
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
  skeletonName: {
    margin: '5px',
    width: '80%',
    height: '25px',
  },
  skeletonStatus: {
    margin: '5px',
    width: '35%',
    height: '18px',
  },
  skeletonRole: {
    margin: '5px',
    width: '100%',
    height: '20px',
  },
  skeletonButton: {
    margin: '0.25em',
    padding: '5px 15px',
    borderRadius: '4px',
    width: '55px',
    height: '25px',
  },
});

export const ChannelUserListItemSkeleton = React.memo(() => {
  const classes = useSkeletonStyles();
  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <div className={`${classes.skeletonIcon} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2} direction="column">
          <div className={`${classes.skeletonName} ${classes.skeleton}`}> </div>
          <div className={`${classes.skeletonStatus} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <div className={`${classes.skeletonRole} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4}>
          <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
          <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
          <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
        </Grid>
      </Grid>
    </ListItem>
  );
});

const StyledBadge = withStyles(() => createStyles({
  badge: {
    left: 13,
    top: 13,
  },
}))(Badge);

type ChannelUserListItemProps = {
  info: MemberType,
  myRole: 'OWNER' | 'ADMIN',
  // eslint-disable-next-line no-unused-vars
  setUser: (value: MemberType) => void,
  setOpen: SetOpenType,
  setDialog: SetDialogType,
  channelName: string,
};

type ButtonObjType = {
  text: string,
  variant: 'contained' | 'outlined' | 'text',
  onClick: React.MouseEventHandler,
};

const makeStatusString = (status: UserStatusType): string => {
  switch (status) {
    case 'ONLINE':
    case 'OFFLINE':
      return status;
    case 'IN_GAME':
      return '게임 중';
    default:
      return '';
  }
};

const makeRoleString = (role: MembershipRole): string => {
  switch (role) {
    case 'OWNER':
      return '채널 주인';
    case 'ADMIN':
      return '관리자';
    case 'BANNED':
      return '차단된 유저';
    default:
      return '채팅 참여자';
  }
};

const ChannelUserListItem = ({
  info, myRole, setUser, setOpen, setDialog, channelName,
}: ChannelUserListItemProps) => {
  const {
    id, name, avatar, status, memberships,
  } = info;
  const { role, unmutedAt } = memberships[0];
  const appDispatch = useAppDispatch();
  const errorMessageHandler = useError();
  const me = useUserState();
  const classes = useStyles({ status, role });

  if (me.id === id) return null;

  const handlePatchRequest = useCallback((
    comment: string,
    type: 'ADMIN' | 'MEMBER' | 'BANNED' | 'mute' | 'unmute',
  ) => {
    const path = ['ADMIN', 'MEMBER', 'BANNED'].includes(type) ? 'role' : type;
    appDispatch({ type: 'loading' });
    axios.patch(`/channels/${channelName}/members/${name}/${path}`,
      path !== type ? { role: type } : null)
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        setUser({
          ...info,
          memberships: [{
            role: data.role, unmutedAt: data.unmutedAt, createdAt: data.createdAt,
          }],
        });
        toast(comment);
      })
      .catch((error) => { errorMessageHandler(error); });
    setOpen(false);
  }, [info, channelName]);

  const handleUnBanUser = useCallback(() => {
    appDispatch({ type: 'loading' });
    axios.delete(`/channels/${channelName}/members/${name}`)
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        setUser({
          ...info,
          memberships: [{
            role: 'NONE', unmutedAt: data.unmutedAt, createdAt: data.createdAt,
          }],
        });
        toast('유저에 대한 차단을 취소하였습니다.');
      })
      .catch((error) => { errorMessageHandler(error); });
    setOpen(false);
  }, [info, channelName]);

  const makeBanButton = useCallback((): ButtonObjType => {
    switch (role) {
      case 'BANNED':
        return {
          text: '차단 해제',
          variant: 'contained',
          onClick: () => {
            setDialog({
              title: '차단 해제',
              content: `${name}님을 차단 해제하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => handleUnBanUser()}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => setOpen(false),
            });
            setOpen(true);
          },
        };
      default:
        return {
          text: '유저 차단',
          variant: 'outlined',
          onClick: () => {
            setDialog({
              title: '유저 차단',
              content: `${name}님을 채널에서 차단하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => handlePatchRequest('유저를 채널에서 차단하였습니다.', 'BANNED')}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => setOpen(false),
            });
            setOpen(true);
          },
        };
    }
  }, [info]);

  const makeMuteButton = useCallback((): ButtonObjType => {
    switch (unmutedAt) {
      case null:
        return {
          text: '유저 뮤트',
          variant: 'outlined',
          onClick: () => {
            setDialog({
              title: '유저 뮤트',
              content: `${name}님을 1분간 뮤트하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => handlePatchRequest('해당 유저가 1분간 뮤트되었습니다.', 'mute')}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => setOpen(false),
            });
            setOpen(true);
          },
        };
      default:
        return {
          text: '뮤트 해제',
          variant: 'contained',
          onClick: () => {
            setDialog({
              title: '뮤트 해제',
              content: `${name}님의 뮤트를 해제하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => handlePatchRequest('해당 유저의 뮤트가 취소되었습니다.', 'unmute')}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => setOpen(false),
            });
            setOpen(true);
          },
        };
    }
  }, [info]);

  const makeAdminButton = useCallback((): ButtonObjType => {
    switch (role) {
      case 'ADMIN':
        return {
          text: '관리 파직',
          variant: 'contained',
          onClick: () => {
            setDialog({
              title: '관리자 권한 박탈',
              content: `${name}님의 권한을 일반 멤버로 변경하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => handlePatchRequest('해당 유저의 권한을 일반 멤버로 변경하였습니다.', 'MEMBER')}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => setOpen(false),
            });
            setOpen(true);
          },
        };
      default:
        return {
          text: '관리 임명',
          variant: 'outlined',
          onClick: () => {
            setDialog({
              title: '관리자 권한 부여',
              content: `${name}님에게 관리자 권한을 부여하시겠습니까? 관리자는 유저 추방(차단) 및 유저 뮤트를 할 수 있습니다.`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => handlePatchRequest('해당 유저의 권한을 관리자로 변경하였습니다.', 'ADMIN')}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => setOpen(false),
            });
            setOpen(true);
          },
        };
    }
  }, [info]);

  const makeButtonArray = useCallback(() => {
    const array: ButtonObjType[] = [];
    array.push(makeBanButton());
    array.push(makeMuteButton());
    if (myRole === 'OWNER') array.push(makeAdminButton());
    return (array);
  }, [info]);

  const Buttons = makeButtonArray().map((button) => (
    <Grid item key={button.text}>
      <Button
        onClick={button.onClick}
        key={button.text}
        variant={button.variant}
      >
        {button.text}
      </Button>
    </Grid>
  ));

  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <StyledBadge
            style={{ marginBottom: '0' }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            overlap="circular"
            badgeContent={['ADMIN', 'OWNER'].includes(role) ? (
              <SecurityRoundedIcon
                color={role === 'OWNER' ? 'secondary' : 'primary'}
                fontSize="small"
              />
            ) : <></>}
          >
            <Avatar src={avatar} alt={name} />
          </StyledBadge>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={3} direction="column">
          <Typo variant="h6">{name}</Typo>
          <Typo className={classes.status} variant="subtitle1">{makeStatusString(status)}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="subtitle1" className={classes.role}>{makeRoleString(role)}</Typo>
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4}>
          {role === 'OWNER' ? null : Buttons}
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default React.memo(ChannelUserListItem);
