import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GamePlayPage from './GamePlayPage';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import ContextProvider from '../../../utils/hooks/useContext';

export default {
  title: 'Pages/GamePlayPage',
  component: GamePlayPage,
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
          main={<GamePlayPage />}
          chat={<div className={classes.div}>chat. 배경색은 스토리에서 적용한 것입니다!</div>}
        />
      </ContextProvider>
    </BrowserRouter>
  );
};
