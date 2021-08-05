/* eslint-disable arrow-body-style */
import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MainTemplate from './MainTemplate';

export default {
  component: MainTemplate,
  title: 'templates/MainTemplate',
} as Meta;

const useStyles = makeStyles({
  div: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '100%',
  },
});

export const Default = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <MainTemplate
        main={<div className={classes.div}>main. 배경색은 스토리에서 적용한 것입니다!</div>}
        chat={<div className={classes.div}>chat. 배경색은 스토리에서 적용한 것입니다!</div>}
      />
    </BrowserRouter>
  );
};
