import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeStyles, Grid } from '@material-ui/core';
import {
  Typo, Button, Dialog, UserInfoForm,
} from '~components/index';
import { asyncGetRequest } from '~utils/index';
import { useAppDispatch, useDialog } from '~hooks/index';

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
  const [ftId, setFtId] = useState<string>('');
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const classes = useStyles();
  const history = useHistory();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({ type: 'loading' });
    asyncGetRequest('/users/me')
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        toast.error('잘못된 접근입니다.');
        history.replace('/');
      })
      .catch(() => {
        const id: string | undefined = Cookies.get('ftId');
        if (id) setFtId(id);
        else {
          toast.error('가입 중 문제가 생겼습니다. 회원가입을 다시 시도해주세요.');
          history.push('/');
        }
      });
  }, []);
  return (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={<Button variant="text" onClick={() => { history.push('/'); }}>확인</Button>}
        onClose={dialog.onClose}
      />
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
          <UserInfoForm
            currentName=""
            currentAvatarSrc=""
            current2FA={false}
            setOpen={setOpen}
            setDialog={setDialog}
            ftId={ftId}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default RegisterPage;
