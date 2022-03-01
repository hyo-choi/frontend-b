import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GamePage from './GamePage';
import MainTemplate from '~components/templates/MainTemplate/MainTemplate';
import ContextProvider from '~hooks/useContext';

export default {
  title: 'Pages/GamePage',
  component: GamePage,
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
        <MainTemplate
          main={<GamePage />}
          chat={<div className={classes.div}>chat. 배경색은 스토리에서 적용한 것입니다!</div>}
        />
      </ContextProvider>
    </BrowserRouter>
  );
};
