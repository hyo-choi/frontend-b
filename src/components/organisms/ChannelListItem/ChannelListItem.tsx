import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import Badge from '@material-ui/core/Badge';
import Typo from '../../atoms/Typo/Typo';
import { DialogProps } from '../../../utils/hooks/useDialog';
import ListItem from '../../atoms/ListItem/ListItem';
import { MembershipRole, ChannelType } from '../../../types/Chat';
import Button from '../../atoms/Button/Button';

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

export const ChannelListItemSkeleton = () => {
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
};

// FIXME: API구현되고 나서 Dialog, setOpen 구현하기
type ChannelListItemProps = {
  info: ChannelType,
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  setDialog: (value: DialogProps) => void,
};

const makeDateString = (date: Date) => `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

const ChannelListItem = ({
  // eslint-disable-next-line no-unused-vars
  info, setOpen, setDialog,
}: ChannelListItemProps) => {
  const {
    name, role, unreads, isLocked, updatedAt,
  } = info;
  const dateStr = makeDateString(updatedAt);
  const classes = useStyles();
  const JoinButton = () => (<Button variant="outlined" onClick={() => {}}>채널 가입</Button>);
  const ManageButton = () => (<Button variant="outlined" onClick={() => {}}>채널 관리</Button>);
  const GoChatButton = () => (<Button variant="outlined" onClick={() => {}}>채팅 참가</Button>);

  const Buttons = (opt: MembershipRole) => {
    switch (opt) {
      case 'MEMBER':
        return (
          <Grid item>
            <GoChatButton />
          </Grid>
        );
      case 'OWNER':
      case 'ADMIN':
        return (
          <>
            <Grid item>
              <ManageButton />
            </Grid>
            <Grid item>
              <GoChatButton />
            </Grid>
          </>
        );
      case 'NONE':
      default:
        return (<JoinButton />);
    }
  };

  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="body1">{dateStr}</Typo>
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
          { Buttons(role) }
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ChannelListItem;
