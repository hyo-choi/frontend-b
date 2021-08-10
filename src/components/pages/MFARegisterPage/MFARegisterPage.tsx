// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '../../atoms/Button/Button';
import Dialog from '../../molecules/Dialog/Dialog';
import LoginTemplate from '../../templates/LoginTemplate/LoginTemplate';
import { useAppDispatch } from '../../../utils/hooks/useContext';
import makeAPIPath from '../../../utils/utils';
import Typo from '../../atoms/Typo/Typo';

const useStyles = makeStyles({
  image: {
    margin: '1em',
    display: 'block',
  },
});

const MFARegisterPage = () => {
  const [QRImageSrc, setQRSrc] = useState<string>('');
  const [isConfirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [isRegisterOpen, setRegisterOpen] = useState<boolean>(false);
  const classes = useStyles();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    appDispatch({ type: 'loading' });

    fetch(makeAPIPath('/auth/otp/qrcode'), { credentials: 'include' })
      .finally(() => { appDispatch({ type: 'endLoading' }); })
      .then((response) => response.blob())
      .then((blob) => setQRSrc(URL.createObjectURL(blob)))
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleClick = () => {
    setConfirmOpen(true);
  };

  const buttons = (
    <>
      <Button variant="text" onClick={() => { setConfirmOpen(false); }}>아니오, 아직 등록하지 않았습니다</Button>
      <Button onClick={() => {
        setConfirmOpen(false);
        setRegisterOpen(true);
      }}
      >
        네, 등록을 완료했습니다
      </Button>
    </>
  );

  return (
    <>
      <Dialog
        isOpen={isConfirmOpen}
        title="QR 코드 등록 확인"
        content="Google OTP 앱에 QR 코드를 정상적으로 등록하셨나요? QR 코드를 등록하지 않고 해당 페이지를 벗어나면 2FA 인증이 불가능합니다. 확인하셨다면 아래 버튼을 클릭해주세요."
        buttons={buttons}
        handleClose={() => { setConfirmOpen(false); }}
      />
      <Dialog
        isOpen={isRegisterOpen}
        title="회원가입 완료"
        content="회원가입이 완료되어 로그인 화면으로 돌아갑니다. 서비스를 이용하시려면 로그인 해주세요."
        buttons={<Button variant="text" onClick={() => { history.push('/'); }}>확인</Button>}
        handleClose={() => { history.push('/'); }}
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
