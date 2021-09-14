import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppState } from '../../../utils/hooks/useAppContext';
import { asyncGetRequest, errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import { SetOpenType } from '../../../utils/hooks/useDialog';
import Input from '../../atoms/Input/Input';
import Switch from '../../atoms/Switch/Switch';
import Typo from '../../atoms/Typo/Typo';
import Button from '../../atoms/Button/Button';

const useStyles = makeStyles({
  edit: {
    width: '400px',
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
const CHANNEL_NAME_HELPER_TEXT = '앞뒤 공백 없는 한글/영문/숫자/공백 3-18자';
const CHANNEL_PASSWORD_AVAILABLE = '사용할 수 있는 비밀번호';
const CHANNEL_PASSWORD_HELPER_TEXT = '공백 제외 모든 문자+숫자 4-32자';
const PASSWORD_CHECK_YES = '비밀번호 일치';
const PASSWORD_CHECK_NO = '비밀번호 일치하지 않음';

type ChannelInfoFormProps = {
  setOpen: SetOpenType,
  channel?: string,
};

const ChannelInfoForm = ({ setOpen, channel }: ChannelInfoFormProps) => {
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
  const appState = useAppState();
  const classes = useStyles();
  const history = useHistory();

  const handleChannelNameChange = (event: React.ChangeEvent<Element>) => {
    const { value } = (event as React.ChangeEvent<HTMLInputElement>).target;
    if (value.length > 18) return;
    if (/^[^\s]+(\s+[^\s]+)*$/.test(value) && /^[0-9a-zA-z\uAC00-\uD7A3\s]{3,18}$/.test(value)) {
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
    if (/^[\S]{4,32}$/.test(value)) {
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
    appDispatch({ type: 'loading' });
    axios.post(makeAPIPath('/channels'),
      isToggleChecked ? { name: channelName, password: checkPassword }
        : { name: channelName })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        setOpen(false);
        toast(`${channelName} 채널이 생성되었습니다.`);
        appDispatch({
          type: 'join',
          channels: appState.channels.concat({
            id: data.id,
            name: data.name,
            role: 'OWNER',
            unreads: 0,
            isLocked: data.password !== null,
            updatedAt: new Date(data.updatedAt),
          }),
        });
        if (appState?.socket) appState.socket.emit('joinRoom', { id: data.id });
        history.push('/channel');
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            toast.error('서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
          } else toast.error('입력값이 잘못되었습니다. 다시 확인해주세요.');
        } else toast.error(error.message);
      });
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    appDispatch({ type: 'loading' });
    axios.patch(makeAPIPath(`/channels/${channel}/password`),
      isToggleChecked ? { password: checkPassword } : {})
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        setOpen(false);
        toast('채널 패스워드가 변경되었습니다.');
      })
      .catch((error) => { errorMessageHandler(error); });
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

  useEffect(() => {
    if (channel) {
      setValidChannelName(true);
      setDuplicateChecked(true);
      setChannelName(channel);
      asyncGetRequest(makeAPIPath(`/channels/${channel}`))
        .then(({ data }) => {
          setToggleCheck(data.password !== null);
        })
        .catch((error) => {
          errorMessageHandler(error);
          setOpen(false);
        });
    }
  }, []);

  return (
    <Grid container justifyContent="center" className={channel ? classes.edit : ''}>
      <Grid
        item
        container
        direction="column"
        justifyContent="space-evenly"
      >
        <Typo className={classes.margin}>* 표시: 필수 입력 항목</Typo>
        <form onSubmit={channel ? handleEdit : handleSubmit}>
          <Grid item container className={classes.margin} justifyContent="center">
            <Input
              onChange={handleChannelNameChange}
              label="채널명 입력 *"
              value={channelName}
              helperText={helperTextChannelName}
              error={!isValidChannelName}
              disabled={channel !== ''}
            />
            {!channel && (
            <Button onClick={handleChannelNameCheck} disabled={!isValidChannelName}>중복 체크</Button>)}
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
              {channel ? '채널 정보 변경' : '채널 만들기'}
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

ChannelInfoForm.defaultProps = {
  channel: '',
};

export default ChannelInfoForm;
