import React from 'react';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import SecurityRoundedIcon from '@material-ui/icons/SecurityRounded';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import { useUserState } from '../../../utils/hooks/useContext';
import ListItem from '../../atoms/ListItem/ListItem';
import Typo from '../../atoms/Typo/Typo';
import Avatar from '../../atoms/Avatar/Avatar';
import { MembershipRole, MemberType } from '../../../types/Chat';
import { UserStatusType } from '../../../types/User';
import Button from '../../atoms/Button/Button';

type StyleProps = {
  status: UserStatusType,
  role: MembershipRole,
};

const useStyles = makeStyles({
  root: {
    padding: '0.2em',
    width: '100%',
    height: '60px',
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
    height: '60px',
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

export const ChannelUserListItemSkeleton = () => {
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
};

const StyledBadge = withStyles(() => createStyles({
  badge: {
    right: 18,
    top: 18,
  },
}))(Badge);

type ChannelUserListItemProps = {
  info: MemberType,
  myRole: 'OWNER' | 'ADMIN',
};

type ButtonObjType = {
  text: string,
  variant: 'contained' | 'outlined' | 'text',
  onClick: React.MouseEventHandler,
};

const ChannelUserListItem = ({ info, myRole }: ChannelUserListItemProps) => {
  const {
    id, name, avatar, status, memberships,
  } = info;
  const { role, mutedAt } = memberships[0];
  const me = useUserState();
  const classes = useStyles({ status, role });

  if (me.id === id) return null;

  const makeStatusString = (): string => {
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

  const makeRoleString = (): string => {
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

  const banButton = ((): ButtonObjType => {
    switch (role) {
      case 'BANNED':
        return {
          text: '차단 해제',
          variant: 'contained',
          onClick: () => {}, // FIXME: onClick 구현
        };
      default:
        return {
          text: '유저 차단',
          variant: 'outlined',
          onClick: () => {}, // FIXME: onClick 구현
        };
    }
  })();

  const muteButton = ((): ButtonObjType => {
    switch (mutedAt) {
      case null:
        return {
          text: '유저 뮤트',
          variant: 'outlined',
          onClick: () => {}, // FIXME: onClick 구현
        };
      default:
        return {
          text: '뮤트 해제',
          variant: 'contained',
          onClick: () => {}, // FIXME: onClick 구현
        };
    }
  })();

  // FIXME: 관리가 이미있는 데 요청되지 않도록하기
  const adminButton = ((): ButtonObjType => {
    switch (role) {
      case 'ADMIN':
        return {
          text: '관리 파직',
          variant: 'contained',
          onClick: () => {}, // FIXME: onClick 구현
        };
      default:
        return {
          text: '관리 임명',
          variant: 'outlined',
          onClick: () => {}, // FIXME: onClick 구현
        };
    }
  })();

  const buttonArray = () => {
    const array: ButtonObjType[] = [];
    array.push(banButton);
    array.push(muteButton);
    if (myRole === 'OWNER') array.push(adminButton);
    return (array);
  };

  const Buttons = buttonArray().map((button) => (
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
          <Typo className={classes.status} variant="subtitle1">{makeStatusString()}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="subtitle1" className={classes.role}>{makeRoleString()}</Typo>
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4}>
          {role === 'OWNER' ? null : Buttons}
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ChannelUserListItem;
