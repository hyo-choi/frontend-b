import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typo from '../../atoms/Typo/Typo';
import { UserInfoType } from '../../../types/User';
import { GameModeType } from '../../../types/Match';
import Avatar from '../../atoms/Avatar/Avatar';
import ListClickItem from '../../atoms/ListClickItem/ListClickItem';

const useStyles = makeStyles({
  root: {
    padding: '0.2em',
    width: '100%',
    height: '60px',
    '&:hover': { color: '#208fea' },
  },
  image: {
    width: '30px',
    height: '30px',
  },
  classic: {
    filter: 'opacity(.5) drop-shadow(0 0 0 blue)',
    '@supports ( -moz-appearance:none )': {
      filter: 'opacity(.5) drop-shadow(0.01rem 0.01rem 0.01rem blue)',
    },
    '&::-webkit-filter': 'opacity(.5) drop-shadow(0 0 0 blue)',
  },
  reverse: {
    filter: 'opacity(.5) drop-shadow(0 0 0 red)',
    '@supports ( -moz-appearance:none )': {
      filter: 'opacity(.5) drop-shadow(0.01rem 0.01rem 0.01rem red)',
    },
    '&::-webkit-filter': 'opacity(.5) drop-shadow(0 0 0 red)',
  },
  speed: {
    filter: 'opacity(.5) drop-shadow(0 0 0 yellow)',
    '@supports ( -moz-appearance:none )': {
      filter: 'opacity(.5) drop-shadow(0.01rem 0.01rem 0.01rem yellow)',
    },
    '&::-webkit-filter': 'opacity(.5) drop-shadow(0 0 0 yellow)',
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
  skeletonAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
  },
  skeletonName: {
    margin: '5px',
    width: '40%',
    height: '25px',
  },
  skeletonVersus: {
    margin: '5px',
    width: '13%',
    height: '25px',
  },
});

export const GameListItemSkeleton = () => {
  const classes = useStyles();
  return (
    <ListClickItem onClick={() => {}}>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="flex-end" alignItems="center" xs={1} spacing={1}>
          <div className={`${classes.skeletonIcon} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4} spacing={1}>
          <div className={`${classes.skeletonName} ${classes.skeleton}`}> </div>
          <Grid item container justifyContent="center" alignItems="center" xs={4} spacing={1}>
            <div className={`${classes.skeletonAvatar} ${classes.skeleton}`}> </div>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <div className={`${classes.skeletonVersus} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="flex-start" alignItems="center" xs={4} spacing={1}>
          <Grid item container justifyContent="center" alignItems="center" xs={4} spacing={1}>
            <div className={`${classes.skeletonAvatar} ${classes.skeleton}`}> </div>
          </Grid>
          <div className={`${classes.skeletonName} ${classes.skeleton}`}> </div>
        </Grid>
      </Grid>
    </ListClickItem>
  );
};

type GameListItemProps = {
  leftUser: UserInfoType,
  rightUser: UserInfoType,
  mode: GameModeType,
  onClick: React.MouseEventHandler,
};

const GameListItem = ({
  leftUser, rightUser, mode, onClick,
}: GameListItemProps) => {
  const classes = useStyles();
  const makeIcon = () => {
    switch (mode) {
      case 'SPEED':
        return (
          <Tooltip arrow title="Speed Mode">
            <img src="/images/fast.png" alt="Speed Mode" className={`${classes.image} ${classes.speed}`} />
          </Tooltip>
        );
      case 'REVERSE':
        return (
          <Tooltip arrow title="Reverse Mode">
            <img src="/images/reverse.png" alt="Reverse Mode" className={`${classes.image} ${classes.reverse}`} />
          </Tooltip>
        );
      case 'CLASSIC':
      default:
        return (
          <Tooltip arrow title="Classic Mode">
            <img src="/images/normal.png" alt="Classic Mode" className={`${classes.image} ${classes.classic}`} />
          </Tooltip>
        );
    }
  };
  return (
    <ListClickItem onClick={onClick}>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="flex-end" alignItems="center" xs={1} spacing={1}>
          {makeIcon()}
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center" xs={4} spacing={1}>
          <Typo variant="h6">{leftUser.name}</Typo>
          <Grid item container justifyContent="center" alignItems="center" xs={4} spacing={1}>
            <Avatar src={leftUser.avatar} alt={leftUser.name} />
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={2}>
          <Typo variant="body1">VS</Typo>
        </Grid>
        <Grid item container justifyContent="flex-start" alignItems="center" xs={4} spacing={1}>
          <Grid item container justifyContent="center" alignItems="center" xs={4} spacing={1}>
            <Avatar src={rightUser.avatar} alt={rightUser.name} />
          </Grid>
          <Typo variant="h6">{rightUser.name}</Typo>
        </Grid>
      </Grid>
    </ListClickItem>
  );
};

export default GameListItem;
