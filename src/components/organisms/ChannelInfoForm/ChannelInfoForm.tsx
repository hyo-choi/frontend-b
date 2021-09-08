import React, { useState } from 'react';
import axios from 'axios';
import { Grid, makeStyles } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../../utils/hooks/useContext';
import { makeAPIPath } from '../../../utils/utils';
import Input from '../../atoms/Input/Input';
import Switch from '../../atoms/Switch/Switch';
import Typo from '../../atoms/Typo/Typo';
import Button from '../../atoms/Button/Button';

const useStyles = makeStyles({
  root: {
    padding: '5em 0',
    width: '350px',
  },
  margin: {
    marginBottom: '1em',
  },
  button: {
    marginTop: '1.68em',
    width: '32.8%',
  },
});

const CHANNEL_NAME_AVAILABLE = '채널명 중복검사를 실행하세요';
const CHANNEL_NAME_HELPER_TEXT = '맨 앞, 뒤 공백 없는 모든 문자 3-18자';
const CHANNEL_PASSWORD_AVAILABLE = '사용할 수 있는 비밀번호';
const CHANNEL_PASSWORD_HELPER_TEXT = '공백 제외 모든 문자+숫자 8-32자';
const PASSWORD_CHECK_YES = '비밀번호 일치';
const PASSWORD_CHECK_NO = '비밀번호 일치하지 않음';

// eslint-disable-next-line no-unused-vars
type ChannelInfoFormProps = { setOpen: (isOpen:boolean) => void };

const ChannelInfoForm = ({ setOpen }: ChannelInfoFormProps) => {
  const [channelName, setChannelName] = useState<string>('');
  const [isValidChannelName, setValidChannelName] = useState<boolean>(false);
  // eslint-disable-next-line max-len
  const [helperTextChannelName, setHelperTextChannelName] = useState<string>(CHANNEL_NAME_HELPER_TEXT);
  const [isToggleChecked, setToggleCheck] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [isValidPassword, setValidPassword] = useState<boolean>(false);
  // eslint-disable-next-line max-len
  const [helperTextPassword, setHelperTextPassword] = useState<string>(CHANNEL_PASSWORD_HELPER_TEXT);
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [isValidCheckPassword, setValidCheckPassword] = useState<boolean>(false);
  // eslint-disable-next-line max-len
  const [helperTextCheckPassword, setHelperTextCheckPassword] = useState<string>(CHANNEL_PASSWORD_HELPER_TEXT);
  const [isDuplicateChecked, setDuplicateChecked] = useState<boolean>(false);
  const appDispatch = useAppDispatch();
  const classes = useStyles();

  const handleChannelNameChange = (event: React.ChangeEvent<Element>) => {
    const { value } = (event as React.ChangeEvent<HTMLInputElement>).target;
    if (value.length > 18) return;
    if (/^[^\s]+(\s+[^\s]+)*$/.test(value) && /^.{3,18}$/.test(value)) {
      setValidChannelName(true);
      setHelperTextChannelName(CHANNEL_NAME_AVAILABLE);
    } else {
      setValidChannelName(false);
      setHelperTextChannelName(CHANNEL_NAME_HELPER_TEXT);
    }
    setChannelName(value);
    setDuplicateChecked(false);
  };

  const handlePasswordChange = (event: React.ChangeEvent<Element>) => {
    const { value } = (event as React.ChangeEvent<HTMLInputElement>).target;
    if (value.length > 32) return;
    if (/^[\S]{8,32}$/.test(value)) {
      setValidPassword(true);
      setHelperTextPassword(CHANNEL_PASSWORD_AVAILABLE);
    } else {
      setValidPassword(false);
      setHelperTextPassword(CHANNEL_PASSWORD_HELPER_TEXT);
    }
    if (checkPassword === value) {
      setValidCheckPassword(true);
      setHelperTextCheckPassword(PASSWORD_CHECK_YES);
    } else {
      setValidCheckPassword(false);
      setHelperTextCheckPassword(PASSWORD_CHECK_NO);
    }
    setPassword(value);
  };

  const handleCheckPasswordChange = (event: React.ChangeEvent<Element>) => {
    const { value } = (event as React.ChangeEvent<HTMLInputElement>).target;
    if (value.length > 32) return;
    if (value === password) {
      setValidCheckPassword(true);
      setHelperTextCheckPassword(PASSWORD_CHECK_YES);
    } else {
      setValidCheckPassword(false);
      setHelperTextCheckPassword(PASSWORD_CHECK_NO);
    }
    setCheckPassword(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // FIXME: API 확정된 후 추가하기
  };

  const handleChannelNameCheck = () => {
    appDispatch({ type: 'loading' });
    axios.head(makeAPIPath(`/channels/${channelName}`))
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        setHelperTextChannelName('중복된 채널명입니다. 다른 채널명을 입력해주세요.');
        setValidChannelName(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setHelperTextChannelName('사용할 수 있는 채널명입니다.');
          setValidChannelName(true);
          setDuplicateChecked(true);
        } else toast.error(error.message);
      });
  };

  const isValidForm = () => {
    if (!isToggleChecked) {
      if (isValidChannelName && isDuplicateChecked) return true;
      return false;
    }
    if (isValidChannelName && isValidPassword
      && isValidCheckPassword && isDuplicateChecked) return true;
    return false;
  };

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        container
        className={classes.root}
        direction="column"
        justifyContent="space-evenly"
        spacing={3}
      >
        <Typo className={classes.margin}>* 표시: 필수 입력 항목</Typo>
        <form onSubmit={handleSubmit}>
          <Grid item container className={classes.margin} justifyContent="center">
            <Input
              onChange={handleChannelNameChange}
              label="채널명 입력 *"
              value={channelName}
              helperText={helperTextChannelName}
              error={!isValidChannelName}
            />
            <Button onClick={handleChannelNameCheck} disabled={!isValidChannelName}>중복 체크</Button>
          </Grid>
          <Grid item container alignItems="center" justifyContent="center">
            <Switch
              name="private toggle"
              checked={isToggleChecked}
              onChange={() => { setToggleCheck(!isToggleChecked); }}
            />
            <Typo>Private</Typo>
          </Grid>
          <Grid>
            {isToggleChecked && (
              <Grid
                item
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Input
                    onChange={handlePasswordChange}
                    label="비밀번호 입력 *"
                    type="password"
                    value={password}
                    helperText={helperTextPassword}
                    error={!isValidPassword}
                    autoComplete
                  />
                </Grid>
                <Grid item>
                  <Input
                    onChange={handleCheckPasswordChange}
                    label="비밀번호 검증 입력 *"
                    type="password"
                    value={checkPassword}
                    helperText={helperTextCheckPassword}
                    error={!isValidCheckPassword}
                    autoComplete
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="center">
            <Button
              variant="text"
              className={classes.button}
              onClick={() => { setOpen(false); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidForm()}
              className={classes.button}
            >
              채널 만들기
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default ChannelInfoForm;
