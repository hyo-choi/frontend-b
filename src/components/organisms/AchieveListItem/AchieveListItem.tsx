import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { Typo, ListItem } from '~components/index';
import { AchievementType } from '~types/Game';
import { makeDateString } from '~utils/utils';
import ACHIEVEMENT_LIST from '~constants/achievements';

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

type AchieveListItemProps = {
  info: AchievementType,
};

export const AchieveListItemSkeleton = React.memo(() => {
  const classes = useStyles();
  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={3}>
          <div className={`${classes.skeletonAvatar} ${classes.skeleton}`}>{}</div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={6}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={3}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
      </Grid>
    </ListItem>
  );
});

const AchieveListItem = ({ info }: AchieveListItemProps) => {
  const { name, description, createdAt } = info;
  const classes = useStyles();

  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={3}>
          {ACHIEVEMENT_LIST[name]}
        </Grid>
        <Grid item container direction="column" justifyContent="center" alignItems="center" xs={6}>
          <Typo variant="h6">{name.replace('_', ' ')}</Typo>
          <Typo variant="subtitle2">{description}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={3}>
          <Typo variant="body1">{makeDateString(createdAt)}</Typo>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default React.memo(AchieveListItem);
