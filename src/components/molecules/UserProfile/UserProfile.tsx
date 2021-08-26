import React from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import { RelatedInfoType, UserStatusType } from '../../../types/User';
import Avatar from '../../atoms/Avatar/Avatar';
import Typo from '../../atoms/Typo/Typo';

type StyleProps = { status: UserStatusType };

const useStyles = makeStyles({
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
});

const StyledBadge = withStyles(() => createStyles({
  badge: {
    right: 18,
    top: 18,
  },
}))(Badge);

export type UserProfileProps = {
  userInfo: RelatedInfoType,
  profile?: boolean,
};

const UserProfile = ({ userInfo, profile }: UserProfileProps) => {
  const {
    name, avatar, status, relationship,
  } = userInfo;
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
        <StyledBadge
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          overlap="circular"
          badgeContent={relationship === 'FRIEND' ? (
            <StarRoundedIcon
              color="secondary"
            />
          ) : <></>}
        >
          <Avatar size="large" alt={name} src={avatar} />
        </StyledBadge>
      </Grid>
      <Grid item xs={6}>
        <Typo variant={profile ? 'h5' : 'h6'}>{name}</Typo>
        <Typo className={classes.status}>{makeStatusString()}</Typo>
        {profile && (
        <Typo
          variant="body2"
          // FIXME: game 관련 정보가 fix되면 수정해야 합니다.
        >
          n점 / n승 n패 (임시)
        </Typo>
        )}
      </Grid>
    </Grid>
  );
};

UserProfile.defaultProps = {
  profile: false,
};

export default UserProfile;
