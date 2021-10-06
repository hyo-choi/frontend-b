import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PlayerProfile from './PlayerProfile';
import ContextProvider from '../../../utils/hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import Typo from '../../atoms/Typo/Typo';
import { UserInfoType } from '../../../types/User';

export default {
  title: 'organisms/PlayerProfile',
  component: PlayerProfile,
} as Meta;

const dummyUserGameInfo: UserInfoType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'USERNAME',
  avatar: '',
  status: 'OFFLINE',
  score: 0,
  win: 0,
  lose: 0,
};

const jikangGameInfo: UserInfoType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'Jikang',
  avatar: 'https://cdn.intra.42.fr/users/medium_jikang.jpg',
  status: 'IN_GAME',
  score: 0,
  win: 4,
  lose: 2,
};

const fakeUserGameInfo: UserInfoType = {
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  name: 'ABCDEFGHIJK',
  avatar: 'https://cdn.intra.42.fr/users/medium_default.png',
  status: 'IN_GAME',
  score: 0,
  win: 40,
  lose: 20,
};

const useStyles = makeStyles({
  div: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '100%',
  },
  gameScreen: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '58vh',
  },
});

export const Default = () => (
  <Grid item container justifyContent="space-between" alignItems="center" xs={10}>
    <PlayerProfile userGameInfo={dummyUserGameInfo} />
  </Grid>
);

export const WithMainTemplate = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <ContextProvider>
        <MainTemplate
          main={(
            <Grid item container justifyContent="space-around" alignItems="center">
              <Grid item container justifyContent="center" alignItems="center" xs={12}>
                <Typo variant="h5">Classic Mode</Typo>
              </Grid>
              <Grid item container justifyContent="center" alignItems="center" xs={10}>
                <div className={classes.gameScreen}>game. 게임 화면</div>
              </Grid>
              <Grid item container justifyContent="space-between" alignItems="center" xs={10}>
                <PlayerProfile userGameInfo={jikangGameInfo} />
                <Typo variant="h5">VS</Typo>
                <PlayerProfile userGameInfo={fakeUserGameInfo} />
              </Grid>
            </Grid>
          )}
          chat={<div className={classes.div}>chat. 배경색은 스토리에서 적용한 것입니다!</div>}
        />
      </ContextProvider>
    </BrowserRouter>
  );
};
