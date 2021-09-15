import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '../../atoms/ListItem/ListItem';
import { UserInfoType } from '../../../types/User';
import Avatar from '../../atoms/Avatar/Avatar';
import Typo from '../../atoms/Typo/Typo';

// FIXME: 임시 Type 작성
export type UserGameInfoType = UserInfoType & { win: number, lose: number };

type PlayerProfileProps = {
  userGameInfo: UserGameInfoType,
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
    name, avatar, win, lose,
  } = userGameInfo;
  const classes = useStyles();

  const makeMatchHistoryString = (): string => (`전적 ${win}승 ${lose}패`);

  return (
    <ListItem>
      <Grid className={classes.root} item container justifyContent="center" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center" xs={12}>
          <Avatar src={avatar} alt={name} />
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={12}>
          <Typo variant="body1">{name}</Typo>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={12}>
          <Typo variant="body2">
            {makeMatchHistoryString()}
          </Typo>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default PlayerProfile;
