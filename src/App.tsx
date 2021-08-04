import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch, useUserState } from './utils/hooks/useContext';
import LoginPage from './components/pages/LoginPage/LoginPage';
import makeAPIPath from './utils/utils';

const App = () => {
  /**
   * FIXME: 아직 API 연동이 안 되어있어서 임시로 progress bar 넣어 둠
   * 해결되면 지우거나 좀 더 괜찮은 모양새로 고칠 것
   */
  const [isLoading, setLoading] = useState<boolean>(false);
  const state = useUserState();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    /**
     * FIXME: 서버가 403 주면 콘솔에 오류 뜸
     * 서버에서 콘솔에 적는 거라 프론트에서 핸들링 불가
     * 그러면 성공 응답을 받아야 하나?
    */
    axios.get(makeAPIPath('/users/me'))
      .finally(() => { setLoading(false); })
      .then((response) => {
        const { id, name, avatar } = response.data;
        dispatch({
          type: 'login',
          info: { id, name, avatar },
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: 'reset' });
        } else {
          toast.error(error.message);
        }
      });
  }, []);

  const children = state.id ? (
    // FIXME: Main Page 컴포넌트가 없어 임시로 적어 둠
    // register page에서 세션 있는지, id 검증까지 하도록 해야 하나?
    <Switch>
      <Route exact path="/" render={() => <h1>main page</h1>} />
    </Switch>
  ) : (
    <Switch>
      <Route exact path="/register" render={() => <h1>register page</h1>} />
      <Route path="/" component={LoginPage} />
    </Switch>
  );

  return (
    <>
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
      {isLoading ? <LinearProgress /> : children}
    </>
  );
};

export default App;
