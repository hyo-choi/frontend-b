import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeStyles, Grid } from '@material-ui/core';
import {
  Button, Dialog, LoginTemplate, Typo,
} from '~components/index';
import { RawUserInfoType } from '~types/index';
import { useAppDispatch, useDialog, useError } from '~hooks/index';
import { asyncGetRequest, makeAPIPath } from '~utils/index';

const useStyles = makeStyles({
  image: {
    margin: '1em',
    display: 'block',
  },
});

const MFARegisterPage = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const [QRImageSrc, setQRSrc] = useState<string>('');
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const classes = useStyles();
  const appDispatch = useAppDispatch();
  const errorMessageHandler = useError();
  const history = useHistory();

  useEffect(() => {
    appDispatch({ type: 'loading' });
    asyncGetRequest('/users/me')
      .then(({ data }: { data: RawUserInfoType }) => {
        const { enable2FA, authenticatorSecret } = data;
        if (!enable2FA || (enable2FA && authenticatorSecret)) {
          toast.error('잘못된 접근입니다.');
          history.replace('/');
        }
        return fetch(makeAPIPath('/auth/otp/qrcode'), { credentials: 'include' });
      })
      .finally(() => { appDispatch({ type: 'endLoading' }); })
      .then((response) => response.blob())
      .then((blob) => setQRSrc(URL.createObjectURL(blob)))
      .catch((error) => {
        source.cancel();
        errorMessageHandler(error);
        history.replace('/');
      });

    return () => source.cancel();
  }, []);

  const buttons = (
    <>
      <Button variant="text" onClick={() => { setOpen(false); }}>아니오, 아직 등록하지 않았습니다</Button>
      <Button onClick={() => {
        setDialog({
          title: 'QR코드 등록 완료',
          content: 'QR코드 등록이 완료되어 2FA 인증 화면으로 이동합니다.',
          buttons: <Button variant="text" onClick={() => { history.replace('/2fa'); }}>확인</Button>,
          onClose: () => { history.replace('/2fa'); },
        });
      }}
      >
        네, 등록을 완료했습니다
      </Button>
    </>
  );

  const handleClick = () => {
    setDialog({
      title: 'QR 코드 등록 확인',
      content: 'Google OTP 앱에 QR 코드를 정상적으로 등록하셨나요? QR 코드를 등록하지 않고 해당 페이지를 벗어나면 2FA 인증이 불가능합니다. 확인하셨다면 아래 버튼을 클릭해주세요.',
      buttons,
      onClose: () => { setOpen(false); },
    });
    setOpen(true);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <LoginTemplate
        input={(
          <Grid item container direction="column" alignItems="center">
            <figcaption><Typo>Google OTP 어플리케이션을 설치하고 QR 코드를 스캔해주세요.</Typo></figcaption>
            <figure><img className={classes.image} alt="QR Code" src={QRImageSrc} /></figure>
          </Grid>
        )}
        button={<Button onClick={handleClick}>2FA 등록</Button>}
      />
    </>
  );
};

export default MFARegisterPage;
