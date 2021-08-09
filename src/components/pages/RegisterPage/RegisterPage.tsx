/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MaterialButton from '@material-ui/core/Button';
import { useAppDispatch } from '../../../utils/hooks/useContext';
import makeAPIPath from '../../../utils/utils';
import Input from '../../atoms/Input/Input';
import Typo from '../../atoms/Typo/Typo';
import Switch from '../../atoms/Switch/Switch';
import Button from '../../atoms/Button/Button';
import Avatar from '../../atoms/Avatar/Avatar';

const useStyles = makeStyles({
  root: {
    padding: '5em 0',
    width: '350px',
  },
  margin: {
    marginBottom: '1em',
  },
  button: {
    margin: '0.25em',
  },
});

const RegisterPage = () => {
  const [name, setName] = useState<string>('');
  const [helperText, setHelperText] = useState<string>('영문+숫자 3-12자');
  const [isValidName, setNameValid] = useState<boolean>(false);
  const [isNameChecked, setNameChecked] = useState<boolean>(false);
  const [is2FAEnabled, set2FA] = useState<boolean>(false);
  const [filename, setFilename] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | Blob>('');
  const [previewSrc, setPreviewSrc] = useState<string>(makeAPIPath('/files/avatar/default.png'));
  const appDispatch = useAppDispatch();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (!imageFile) {
      setPreviewSrc(makeAPIPath('/files/avatar/default.png'));
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (event.target) setPreviewSrc(String(event.target.result));
    };
    fileReader.readAsDataURL(imageFile as Blob);
  }, [imageFile]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const split = event.target.value.split('\\');
    setFilename(split[split.length - 1]);
    if (event.target.files) setImageFile(event.target.files[0]);
    else setImageFile(new Blob());
  };

  const handleNameChange = (event: React.ChangeEvent<Element>) => {
    const { value } = (event as React.ChangeEvent<HTMLInputElement>).target;
    if (value.length > 12) return;

    setHelperText('영문+숫자 3-12자');
    if (/^[A-Za-z0-9+]{3,12}$/.test(value)) setNameValid(true);
    else setNameValid(false);
    setName(value);
    setNameChecked(false);
  };

  const handleNameCheck = () => {
    appDispatch({ type: 'loading' });
    axios.head(makeAPIPath(`/users/name/${name}`))
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        setHelperText('중복된 닉네임입니다. 다른 닉네임을 입력해주세요.');
        setNameValid(false);
        setNameChecked(false);
      })
      .catch((error) => {
        if (error.response) {
          setHelperText('사용할 수 있는 닉네임입니다.');
          setNameChecked(true);
        } else toast.error(error.message);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('avatar', imageFile);
    formData.append('name', name);
    formData.append('enable2FA', String(is2FAEnabled));
    appDispatch({ type: 'loading' });
    axios({
      url: makeAPIPath('/users'),
      method: 'post',
      data: formData,
    })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        if (is2FAEnabled) {
          history.push('/register/2fa');
        } else {
          history.push('/');
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            toast.error('서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
          } else toast.error('입력값이 잘못되었습니다. 다시 확인해주세요.');
        } else toast.error(error.message);
      });
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
        <Typo variant="h3" align="center" gutterBottom>Register Form</Typo>
        <Typo>* 표시: 필수 입력 항목</Typo>
        <Grid item container justifyContent="space-evenly" alignItems="center">
          <Avatar size="large" alt={name} src={previewSrc} />
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid item container className={classes.margin} justifyContent="space-between">
            <Input onChange={handleNameChange} label="닉네임 *" value={name} helperText={helperText} error={!isValidName} />
            <Button onClick={handleNameCheck} disabled={!isValidName}>중복 체크</Button>
          </Grid>
          <Grid item container className={classes.margin} direction="column">
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
          <Grid item container className={classes.margin} justifyContent="space-between">
            <Typo variant="subtitle1">2 Factor 인증 사용 여부</Typo>
            <Switch checked={is2FAEnabled} onChange={() => { set2FA(!is2FAEnabled); }} />
          </Grid>
          <Grid item container justifyContent="center">
            <Button type="submit" disabled={!isNameChecked}>회원 가입</Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
