import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserDispatch, useUserState } from '../../../utils/hooks/useUserContext';
import { useAppDispatch } from '../../../utils/hooks/useAppContext';
import { makeAPIPath } from '../../../utils/utils';
import Button from '../../atoms/Button/Button';
import DigitInput from '../../atoms/DigitInput/DigitInput';
import Typo from '../../atoms/Typo/Typo';
import LoginTemplate from '../../templates/LoginTemplate/LoginTemplate';

const useStyles = makeStyles({
  inputs: {
    margin: '1em',
  },
  typo: {
    color: 'gray',
  },
});

type DigitString = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '';

const usePrevious = (value: DigitString[]) => {
  const ref = useRef<DigitString[]>(['', '', '', '', '', '']);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const MFAPage = () => {
  const [inputs, setInputs] = useState<DigitString[]>(['', '', '', '', '', '']);
  const refs = inputs.map(() => useRef<HTMLInputElement | HTMLTextAreaElement>(null));
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const history = useHistory();
  const userState = useUserState();
  const prevInputs = usePrevious(inputs);
  const classes = useStyles();

  useEffect(() => {
    const { enable2FA, authenticatorSecret, isSecondFactorAuthenticated } = userState;
    if (!enable2FA || (enable2FA && authenticatorSecret && isSecondFactorAuthenticated)) {
      toast.error('잘못된 접근입니다.');
      history.replace('/');
    }
  }, []);

  useEffect(() => {
    let idx = 0;
    for (let i = 0; i < 6; i += 1) {
      if (inputs[i] !== prevInputs[i]) {
        idx = i;
        break;
      }
    }
    if (idx !== 5 && inputs[idx] !== '') refs[idx + 1].current?.focus();
    else if (idx === 0) refs[0].current?.focus();
  }, [inputs]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (value === '' || /^[0-9]$/.test(value)) {
      const index = Number(name);
      const renew: DigitString[] = inputs.map((input: DigitString, idx): DigitString => (
        idx === index ? value as DigitString : input
      ));
      setInputs(renew);
    }
  };

  const Inputs = inputs.map((input, idx) => (
    <DigitInput
      key={`digit${String(idx)}`}
      onChange={handleChange}
      name={String(idx)}
      value={input}
      ref={refs[idx]}
    />
  ));

  const handleClick = () => {
    appDispatch({ type: 'loading' });
    axios.post(makeAPIPath('/auth/otp'), { token: inputs.join('') })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then((response) => {
        const {
          id, name, avatar, enable2FA, authenticatorSecret, isSecondFactorAuthenticated,
        } = response.data;
        userDispatch({
          type: 'login',
          info: {
            id,
            name,
            avatar: makeAPIPath(`/${avatar}`),
            enable2FA,
            authenticatorSecret,
            isSecondFactorAuthenticated,
          },
        });
        appDispatch({ type: 'loading' });
        history.push('/');
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) toast.error('인증 번호가 잘못되었습니다.');
        else toast.error(error.message);
      });
  };

  return (
    <LoginTemplate
      input={(
        <Grid item container direction="column" alignItems="center">
          <Typo className={classes.typo}>인증 번호를 정상 입력하였는데도 로그인할 수 없는 경우 담당자에게 문의해주세요.</Typo>
          <main className={classes.inputs}>{Inputs}</main>
        </Grid>
      )}
      button={(
        <>
          <Button variant="outlined" onClick={() => setInputs(['', '', '', '', '', ''])}>RESET</Button>
          <Button onClick={handleClick}>2FA 인증</Button>
        </>
      )}
    />
  );
};

export default MFAPage;
