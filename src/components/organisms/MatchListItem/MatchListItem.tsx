import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typo from '../../atoms/Typo/Typo';
import ListItem from '../../atoms/ListItem/ListItem';
import Avatar from '../../atoms/Avatar/Avatar';
import { UserInfoType } from '../../../types/User';
import { makeDateString } from '../../../utils/utils';
import { GameModeType } from '../../../types/Match';

const useStyles = makeStyles({
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
  skeletonCard: {
    padding: '0.5em',
    width: '100%',
    height: '100px',
  },
  skeletonAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
  },
  skeletonTypo: {
    margin: '5px',
    width: '90%',
    height: '20px',
  },
});

export type MatchListItemProps = {
  opposite: UserInfoType,
  isMeWinner: boolean,
  mode: GameModeType,
  createdAt: Date,
}

export const MatchListItemSkeleton = () => {
  const classes = useStyles();
  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <div className={`${classes.skeletonAvatar} ${classes.skeleton}`}>{}</div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <div className={`${classes.skeletonAvatar} ${classes.skeleton}`}>{}</div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={3}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
      </Grid>
    </ListItem>
  );
};

const MatchListItem = ({
  opposite, isMeWinner, mode, createdAt,
}: MatchListItemProps) => {
  const { avatar, name } = opposite;
  const classes = useStyles();
  const makeIcon = useCallback(() => {
    switch (mode) {
      case 'SPEED':
        return (
          <Tooltip arrow title="Speed Mode">
            <img
              src="/images/fast.png"
              alt="Speed Mode"
              style={{
                width: '30px',
                height: '30px',
                filter: isMeWinner ? 'opacity(.5) drop-shadow(0.01rem 0 0 yellow)' : 'opacity(.2)',
                WebkitFilter: isMeWinner ? 'opacity(.5) drop-shadow(0.01rem 0 0 yellow)' : 'opacity(.2)',
              }}
            />
          </Tooltip>
        );
      case 'REVERSE':
        return (
          <Tooltip arrow title="Reverse Mode">
            <img
              src="/images/reverse.png"
              alt="Reverse Mode"
              style={{
                width: '30px',
                height: '30px',
                filter: isMeWinner ? 'opacity(.5) drop-shadow(0.01rem 0 0 red)' : 'opacity(.2)',
                WebkitFilter: isMeWinner ? 'opacity(.5) drop-shadow(0.01rem 0 0 red)' : 'opacity(.2)',
              }}
            />
          </Tooltip>
        );
      case 'CLASSIC':
      default:
        return (
          <Tooltip arrow title="Classic Mode">
            <img
              src="/images/normal.png"
              alt="Classic Mode"
              style={{
                width: '30px',
                height: '30px',
                filter: isMeWinner ? 'opacity(.5) drop-shadow(0.01rem 0 0 blue)' : 'opacity(.2)',
                WebkitFilter: isMeWinner ? 'opacity(.5) drop-shadow(0.01rem 0 0 blue)' : 'opacity(.2)',
              }}
            />
          </Tooltip>
        );
    }
  }, [mode]);
  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          {makeIcon()}
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <Typo variant="h5">{isMeWinner ? 'WIN' : 'LOSE'}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="body1">VS</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={1}>
          <Avatar src={avatar} alt={name} />
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={3}>
          <Typo variant="h6">{name}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="body1">{makeDateString(createdAt)}</Typo>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default React.memo(MatchListItem);
