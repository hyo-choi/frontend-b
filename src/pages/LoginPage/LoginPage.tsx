import React from 'react';
import { useAppDispatch } from '~hooks/index';
import { makeAPIPath } from '~utils/index';
import { LoginTemplate, Typo, Button } from '~components/index';

const LoginPage = () => {
  const appDispatch = useAppDispatch();
  const handleClick = () => {
    appDispatch({ type: 'loading' });
  };
  return (
    <LoginTemplate
      logo={
        <Typo variant="h1">PONG</Typo>
      }
      button={(
        <Button
          href={makeAPIPath('/auth/42')}
          onClick={handleClick}
        >
          로그인 / 회원가입
        </Button>
      )}
    />
  );
};

export default LoginPage;
