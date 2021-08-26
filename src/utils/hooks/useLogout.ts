import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeAPIPath } from '../utils';
import { useAppDispatch, useUserDispatch } from './useContext';

const useLogout = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();

  const handleLogout = () => {
    appDispatch({ type: 'loading' });
    axios.get(makeAPIPath('/auth/logout'))
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        userDispatch({ type: 'logout' });
        history.push('/');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return handleLogout;
};

export default useLogout;
