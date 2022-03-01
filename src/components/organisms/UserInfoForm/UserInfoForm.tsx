import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid } from '@material-ui/core';
import MaterialButton from '@material-ui/core/Button';
import {
  Typo, Avatar, Input, Button, Switch,
} from '~components/index';
import { makeAPIPath } from '~utils/index';
import {
  useUserDispatch, useAppDispatch, SetDialogType, SetOpenType, useLogout, useError,
} from '~hooks/index';

const useStyles = makeStyles({
  root: {
    padding: '5em 0',
    width: '350px',
  },
  marginBottom: {
    marginBottom: '1em',
  },
  button: {
    margin: '0.25em',
  },
});

type UserInfoFormProps = {
  currentName: string,
  currentAvatarSrc: string,
  current2FA: boolean,
  setOpen: SetOpenType,
  setDialog: SetDialogType,
  ftId?: string,
};

const UserInfoForm = ({
  currentName, currentAvatarSrc, current2FA, setDialog, setOpen, ftId,
}: UserInfoFormProps) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const [username, setUsername] = useState<string>(currentName);
  const [helperText, setHelperText] = useState<string>('영문+숫자 3-12자');
  const [isValidName, setNameValid] = useState<boolean>(false);
  const [isNameChecked, setNameChecked] = useState<boolean>(false);
  const [isAvatarChanged, setAvatarChanged] = useState<boolean>(false);
  const [is2FAChanged, set2FAChanged] = useState<boolean>(false);
  const [is2FAEnabled, set2FA] = useState<boolean>(current2FA);
  const [filename, setFilename] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | Blob>('');
  const [previewSrc, setPreviewSrc] = useState<string>(currentAvatarSrc || makeAPIPath('/files/avatar/default.png'));
  const errorMessageHandler = useError();
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const handleLogout = useLogout();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (currentAvatarSrc !== previewSrc) setAvatarChanged(true);
    else setAvatarChanged(false);
    if (current2FA !== is2FAEnabled) set2FAChanged(true);
    else set2FAChanged(false);
  }, [previewSrc, is2FAEnabled]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewSrc(currentAvatarSrc || makeAPIPath('/files/avatar/default.png'));
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (event.target) setPreviewSrc(String(event.target.result));
    };
    fileReader.readAsDataURL(imageFile as Blob);
  }, [imageFile]);

  useEffect(() => () => source.cancel(), []);

  const handleNameChange = useCallback((event: React.ChangeEvent<Element>) => {
    const { value } = (event as React.ChangeEvent<HTMLInputElement>).target;
    if (value.length > 12) return;

    setHelperText('영문+숫자 3-12자');
    if (/^[A-Za-z0-9]{3,12}$/.test(value)) setNameValid(true);
    else setNameValid(false);
    setUsername(value);
    if (currentName === value) {
      setNameChecked(true);
      setNameValid(false);
    } else {
      setNameChecked(false);
    }
  }, [currentName]);

  const handleNameCheck = useCallback(() => {
    appDispatch({ type: 'loading' });
    axios.head(`/users/${username}`)
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        setHelperText('중복된 닉네임입니다. 다른 닉네임을 입력해주세요.');
        setNameValid(false);
        setNameChecked(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setHelperText('사용할 수 있는 닉네임입니다.');
          setNameChecked(true);
        } else errorMessageHandler(error);
      });
  }, [username]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const split = event.target.value.split('\\');
    setFilename(split[split.length - 1]);
    if (event.target.files) setImageFile(event.target.files[0]);
    else setImageFile(new Blob());
  }, []);

  const handleRegister = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('avatar', imageFile);
    formData.append('name', username);
    formData.append('enable2FA', String(is2FAEnabled));
    formData.append('ftId', ftId!);
    appDispatch({ type: 'loading' });
    axios({
      url: '/users',
      method: 'post',
      data: formData,
    })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        if (is2FAEnabled) {
          setDialog({
            title: '회원가입 완료',
            content: '회원가입이 완료되어 로그인 화면으로 돌아갑니다. 로그인 시 2FA 등록을 진행합니다.',
            onClose: () => { history.push('/'); },
          });
        } else {
          setDialog({
            title: '회원가입 완료',
            content: '회원가입이 완료되어 로그인 화면으로 돌아갑니다. 서비스를 이용하시려면 로그인 해주세요.',
            onClose: () => { history.push('/'); },
          });
        }
        setOpen(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            toast.error('서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
          } else toast.error('입력값이 잘못되었습니다. 다시 확인해주세요.');
        } else errorMessageHandler(error);
      });
  }, [imageFile, username, is2FAEnabled, ftId]);

  const handleEdit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    if (isAvatarChanged) formData.append('avatar', imageFile);
    if (username !== currentName) formData.append('name', username);
    if (is2FAChanged) formData.append('enable2FA', String(is2FAEnabled));
    appDispatch({ type: 'loading' });
    axios({
      url: '/users/me',
      method: 'patch',
      data: formData,
    })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        const {
          id, name, avatar, enable2FA, authenticatorSecret, isSecondFactorAuthenticated,
        } = data;
        userDispatch({
          type: 'edit',
          info: {
            id,
            name,
            avatar,
            enable2FA,
            authenticatorSecret,
            isSecondFactorAuthenticated,
          },
        });
        if (is2FAChanged && is2FAEnabled) {
          setDialog({
            title: '2FA 활성화 완료',
            content: '2FA를 활성화하여 로그아웃됩니다. 다음 로그인 시 2FA 인증을 위한 QR코드 등록 절차가 진행됩니다.',
            buttons: <Button variant="text" onClick={handleLogout}>Close</Button>,
            onClose: handleLogout,
          });
        } else {
          setOpen(false);
          history.push('/profile');
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            toast.error('서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
          } else toast.error('입력값이 잘못되었습니다. 다시 확인해주세요.');
        } else errorMessageHandler(error);
      });
  }, [isAvatarChanged, imageFile, currentName, username, is2FAEnabled, is2FAChanged]);

  const isValidForm = useCallback(() => {
    if (is2FAChanged) {
      if (username === currentName) return is2FAChanged;
      return isNameChecked && is2FAChanged;
    } if (isAvatarChanged) {
      if (username === currentName) return isAvatarChanged;
      return isNameChecked && isAvatarChanged;
    }
    if (username !== currentName) return isNameChecked;
    return false;
  }, [is2FAChanged, username, currentName, isNameChecked, isAvatarChanged]);

  return (
    <>
      <Grid item container justifyContent="space-evenly" alignItems="center">
        <Avatar size="large" alt={username} src={previewSrc} />
      </Grid>
      <form onSubmit={currentName ? handleEdit : handleRegister}>
        <Grid item container className={classes.marginBottom} justifyContent="space-between">
          <Input
            onChange={handleNameChange}
            label="닉네임 *"
            value={username}
            helperText={helperText}
            error={!isValidName && (currentName !== username)}
          />
          <Button onClick={handleNameCheck} disabled={!isValidName}>중복 체크</Button>
        </Grid>
        <Grid item container className={classes.marginBottom} direction="column">
          <Grid item container justifyContent="space-between" alignItems="center">
            <Typo variant="subtitle1">프로필 사진 등록</Typo>
            <MaterialButton className={classes.button} variant="contained" color="primary" component="label">
              <Typo variant="button">파일 선택</Typo>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileSelect}
                hidden
              />
            </MaterialButton>
          </Grid>
          <Typo variant="caption">{filename || '선택된 파일이 없습니다.'}</Typo>
        </Grid>
        <Grid item container className={classes.marginBottom} direction="column">
          <Grid item container justifyContent="space-between">
            <Typo variant="subtitle1">2 Factor 인증 사용 여부</Typo>
            <Switch checked={is2FAEnabled} onChange={() => { set2FA(!is2FAEnabled); }} />
          </Grid>
          {currentName && <Typo variant="caption">2FA 활성화 시 자동 로그아웃됩니다</Typo>}
        </Grid>
        <Grid item container justifyContent="center">
          {
            currentName
              ? (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button type="submit" disabled={!(isValidForm())}>submit</Button>
                </>
              ) : (<Button type="submit" disabled={!isNameChecked}>회원 가입</Button>)
          }
        </Grid>
      </form>
    </>
  );
};

UserInfoForm.defaultProps = {
  ftId: '',
};

export default React.memo(UserInfoForm);
