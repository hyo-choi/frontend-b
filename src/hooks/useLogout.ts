import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from './useAppContext';
import { useUserDispatch } from './useUserContext';

const useLogout = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();

  const handleLogout = () => {
    appDispatch({ type: 'loading' });
    axios.get('/auth/logout')
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        appDispatch({ type: 'disconnect' });
        userDispatch({ type: 'logout' });
        history.push('/');
      })
      .catch(() => {});
  };
  return handleLogout;
};

export default useLogout;
