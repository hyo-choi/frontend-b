import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GameWatchPage from './GameWatchPage';
import MainTemplate from '~components/templates/MainTemplate/MainTemplate';
import ContextProvider from '~hooks/useContext';

export default {
  title: 'Pages/GameWatchPage',
  component: GameWatchPage,
} as Meta;

const useStyles = makeStyles({
  div: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '100%',
  },
});

export const WithMainTemplate = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <ContextProvider>
        <Route
          path={['/game/watch', '/']}
          render={() => (
            <MainTemplate
              main={<GameWatchPage />}
              chat={<div className={classes.div}>chat. 배경색은 스토리에서 적용한 것입니다!</div>}
            />
          )}
        />
      </ContextProvider>
    </BrowserRouter>
  );
};
