import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { UserInfoType } from '../../../types/User';
import Avatar from '../../atoms/Avatar/Avatar';
import Typo from '../../atoms/Typo/Typo';
import { makeMatchHistoryString } from '../../../utils/utils';

type PlayerProfileProps = {
  userGameInfo: UserInfoType,
};

const useStyles = makeStyles({
  root: {
    padding: '0.2em',
    width: '13vw',
    height: '100%',
  },
});

const PlayerProfile = ({ userGameInfo }: PlayerProfileProps) => {
  const {
    name, avatar, score, win, lose,
  } = userGameInfo;
  const classes = useStyles();

  return (
    <Grid className={classes.root} item container xs={12} direction="column" justifyContent="center" alignItems="center">
      <Avatar src={avatar} alt={name} />
      <Typo variant="body1">{name}</Typo>
      <Typo variant="body2">
        {makeMatchHistoryString(score!, win!, lose!)}
      </Typo>
    </Grid>
  );
};

export default PlayerProfile;
