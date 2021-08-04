import React from 'react';
import makeAPIPath from '../../../utils/utils';
import Button from '../../atoms/Button/Button';
import Typo from '../../atoms/Typo/Typo';
import LoginTemplate from '../../templates/LoginTemplate/LoginTemplate';

// eslint-disable-next-line arrow-body-style
const LoginPage = () => {
  return (
    <LoginTemplate
      logo={
        <Typo variant="h1">PONG</Typo>
      }
      button={
        <Button href={makeAPIPath('/auth/42')}>로그인 / 회원가입</Button>
      }
    />
  );
};

export default LoginPage;
