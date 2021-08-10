import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { UserInfoType, UserStatusType } from '../../../types/User';
import Avatar from '../../atoms/Avatar/Avatar';
import Typo from '../../atoms/Typo/Typo';

type styleProps = { status: UserStatusType };

const useStyles = makeStyles({
  status: {
    color: (props: styleProps) => {
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
});

export type UserProfileProps = {
  userInfo: UserInfoType,
};

// eslint-disable-next-line arrow-body-style
const UserProfile = ({ userInfo }: UserProfileProps) => {
  const { name, avatar, status } = userInfo;
  const classes = useStyles({ status });

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

  return (
    <Grid item container justifyContent="space-around" alignItems="center" xs={5}>
      <Grid container item xs={6} justifyContent="center">
        <Avatar size="large" alt={name} src={avatar} />
      </Grid>
      <Grid item xs={6}>
        <Typo variant="h5">{name}</Typo>
        <Typo className={classes.status}>{makeStatusString()}</Typo>
        <Typo
          variant="body2"
          // FIXME: game 관련 정보가 fix되면 수정해야 합니다.
        >
          n점 / n승 n패 (임시)
        </Typo>
      </Grid>
    </Grid>
  );
};

export default UserProfile;
