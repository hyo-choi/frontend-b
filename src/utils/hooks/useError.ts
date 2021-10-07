import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from './useAppContext';
import useLogout from './useLogout';

const useError = () => {
  const handleLogout = useLogout();
  const appDispatch = useAppDispatch();
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const errorMessageHandler = (error: any) => {
    if (error.response?.status === 403 && error.response?.data?.message === 'Forbidden resource') {
      toast.error('세션이 만료되어 5초 후 로그아웃합니다. 다시 로그인해주세요.');
      appDispatch({ type: 'loading' });
      timerId.current = setTimeout(() => {
        appDispatch({ type: 'endLoading' });
        handleLogout();
        window.location.replace('/');
      }, 5000);
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message[0]);
    } else toast.error(error.message);
  };

  useEffect(() => () => {
    appDispatch({ type: 'endLoading' });
    if (timerId) clearTimeout(timerId.current as unknown as number);
  }, []);

  return errorMessageHandler;
};

export default useError;
