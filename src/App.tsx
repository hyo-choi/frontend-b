import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  useAppDispatch, useAppState, useUserDispatch, useUserState,
} from './utils/hooks/useContext';
import LoginPage from './components/pages/LoginPage/LoginPage';
import makeAPIPath from './utils/utils';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import MainTemplate from './components/templates/MainTemplate/MainTemplate';

const useStyles = makeStyles({
  progress: {
    position: 'fixed',
    top: 'calc(40vh)',
    left: 'calc(50vw - 50px)',
    width: '100%',
  },
  block: {
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 1200,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

const App = () => {
  const history = useHistory();
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const userState = useUserState();
  const userDispatch = useUserDispatch();
  const classes = useStyles();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    appDispatch({ type: 'loading' });
    /**
     * NOTE 서버가 실패 응답(예: 403)을 주면 콘솔에 오류가 뜹니다.
     * 서버에서 콘솔에 적도록 하는 것이라 프론트에서 핸들링이 불가한데,
     * 이 부분은 서브젝트 요구사항과 안 맞는 듯해서 추후 고민해봐야 할 것 같습니다.
    */
    axios.get(makeAPIPath('/session'))
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        axios.get(makeAPIPath('/users/me'))
          .then((response) => {
            const { id, name, avatar } = response.data;
            userDispatch({
              type: 'login',
              info: { id, name, avatar },
            });
          })
          .catch((error) => {
            if (error.response) {
              /** FIXME: 로그아웃+2FA 활성 상태에서는 /users/me 응답이 403입니다.
               * 이때문에 로그인 하려는 상황에서도 register로 이동하는 문제가 발생하는데,
               * 2FA 페이지 구현할 때 새로운 API를 이용하여 고치면 될 것 같습니다.
               */
              history.push('/register');
            } else {
              toast.error(error.message);
            }
          });
      })
      .catch((error) => {
        if (error.response) {
          userDispatch({ type: 'reset' });
        } else {
          toast.error(error.message);
        }
      });
  }, []);

  const children = userState.id ? (
    /**
     * FIXME: Main Page 컴포넌트가 없어 임시로 적어 두었습니다.
     * 컴포넌트 구현 후 교체해야 합니다.
     */
    <Switch>
      <Route exact path="/" render={() => <MainTemplate main={<h1>asd</h1>} chat={<h1>asd</h1>} />} />
    </Switch>
  ) : (
    <Switch>
      <Route exact path="/register" component={RegisterPage} />
      <Route path="/" component={LoginPage} />
    </Switch>
  );

  return (
    <>
      {appState.isLoading
        && (
        <div className={classes.block}>
          <CircularProgress
            size={100}
            className={classes.progress}
            aria-busy={appState.isLoading}
          />
        </div>
        )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </>
  );
};

export default App;
