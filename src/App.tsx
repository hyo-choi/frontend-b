import React, { useEffect, useState } from 'react';
import {
  Switch, Route, Redirect, useHistory, useLocation,
} from 'react-router-dom';
import axios from 'axios';
import strictUriEncode from 'strict-uri-encode';
import { io } from 'socket.io-client';
import {
  // eslint-disable-next-line camelcase
  unstable_createMuiStrictModeTheme, makeStyles, ThemeProvider, CircularProgress,
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LoginPage, RegisterPage, MFARegisterPage, MFAPage, CommunityPage, ProfilePage,
  ChannelPage, ChatPage, ChannelManagePage, DMPage, GamePage,
} from '~pages/index';
import {
  asyncGetRequest, makeChannelInfo, DMToMessage, messageToMessage,
} from '~utils/index';
import {
  ChannelType, DMRoomType, MessageType, RawChannelType, RawDMType, RawMessageType, RawUserInfoType,
} from '~types/index';
import {
  useAppDispatch, useAppState, useUserDispatch, useUserState, useDialog, useMatch, useError,
} from '~hooks/index';
import { MainTemplate, Dialog } from '~components/index';

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
    zIndex: 1500,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

const DM_INIT : MessageType = {
  type: 'DM',
  content: 'init',
  user: {
    id: '',
    name: '',
    avatar: '',
    status: 'OFFLINE',
  },
  name: 'init',
  id: '',
  createdAt: new Date(),
};

const App = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const theme = unstable_createMuiStrictModeTheme();
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const userState = useUserState();
  const userDispatch = useUserDispatch();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const errorMessageHandler = useError();
  const [userInfo, setUserInfo] = useState<RawUserInfoType | null>(null);
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [DMs, setDMs] = useState<DMRoomType[]>([]);
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const { handleInvited } = useMatch(setOpen, setDialog);

  useEffect(() => {
    if (userInfo) {
      const socket = io(String(process.env.REACT_APP_API_URL)!, {
        query: { userId: userInfo.id },
      });
      socket.on('connect', () => {
        appDispatch({ type: 'connect', socket });
        userDispatch({
          type: 'login',
          info: { ...userInfo },
        });
        channels.forEach((channel) => socket.emit('joinRoom', { id: channel.id }));
        appDispatch({ type: 'join', channels, DMs });
        appDispatch({ type: 'endLoading' });

        socket.on('message', (data: RawMessageType) => {
          const message = messageToMessage(data);
          appDispatch({ type: 'newMessage', message });
        });

        socket.on('dm', (data: RawDMType) => {
          const message = DMToMessage(data, userInfo.name);
          appDispatch({ type: 'newMessage', message });
        });

        socket.on('banned', (data) => {
          const { name } = data.channel;
          appDispatch({ type: 'exit', name });
          toast.warn(`${name} 채널에서 추방되었습니다.`);
        });

        socket.on('adminToMember', (data) => {
          const { name } = data.channel;
          appDispatch({
            type: 'join',
            channels: appState.channels.map((channel) => (
              channel.name === name ? { ...channel, role: 'MEMBER' } : { ...channel })),
          });
          if (location.pathname === `/channel/manage/${strictUriEncode(name)}`) {
            history.push('/channel');
            toast.warn(`${name} 채널의 권한이 관리자에서 멤버로 변경되었습니다.`);
          }
        });

        socket.on('invitedToMatch', ({ mode, opponent, opponentSocketId }) => {
          handleInvited(mode, opponent, opponentSocketId, socket);
        });
      });
    }
  }, [DMs]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.cancelToken = source.token;
    appDispatch({ type: 'loading' });
    asyncGetRequest('/users/me')
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        const {
          enable2FA, authenticatorSecret, isSecondFactorAuthenticated,
        } = data;
        setUserInfo(data);
        if (enable2FA && !authenticatorSecret) {
          history.push('/register/2fa');
          throw new Error('2FA');
        } else if (enable2FA && !isSecondFactorAuthenticated) {
          history.push('/2fa');
          throw new Error('2FA');
        }
        appDispatch({ type: 'loading' });
        return (asyncGetRequest('/blocks'));
      })
      .then(({ data }: { data: RawUserInfoType[] }) => {
        const list = data.map((user) => user.name);
        appDispatch({ type: 'renewBlockList', list });
        return (asyncGetRequest('/channels/me'));
      })
      .then(({ data }) => {
        setChannels(data.map((channel: RawChannelType) => makeChannelInfo(channel)));
        return (asyncGetRequest('/dmers'));
      })
      .then(({ data }) => {
        setDMs(data.map((dm: RawUserInfoType): DMRoomType => ({
          id: dm.id,
          name: dm.name,
          avatar: dm.avatar,
          status: dm.status,
          latestMessage: DM_INIT,
          unreads: 0,
        })));
      })
      .catch((error) => {
        if (error?.message === '2FA') {
          // eslint-disable-next-line no-console
          console.log('2fa');
        } else if (error.response) {
          userDispatch({ type: 'reset' });
        } else {
          errorMessageHandler(error);
        }
      });

    return () => {
      source.cancel();
      setChannels([]);
      setUserInfo(null);
      setDMs([]);
      appDispatch({ type: 'disconnect' });
    };
  }, []);

  const children = userState.id ? (
    <>
      <Dialog
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        isOpen={isOpen}
        onClose={dialog.onClose}
      />
      <Switch>
        <Route path="/">
          <MainTemplate
            main={(
              <Switch>
                <Route exact path="/">
                  <Redirect to="/game" />
                </Route>
                <Route path="/game" component={GamePage} />
                <Route path="/community" component={CommunityPage} />
                <Route path="/channel/manage/:channelName" component={ChannelManagePage} />
                <Route path="/channel" component={ChannelPage} />
                <Route path="/profile/:username" component={ProfilePage} />
                <Route exact path="/dm" component={DMPage} />
                <Route exact path="/profile">
                  <Redirect to={`/profile/${userState.name}`} />
                </Route>
                <Route exact path="/404" render={() => <h1>404 Not found</h1>} />
                <Route path="/">
                  <Redirect to="/404" />
                </Route>
              </Switch>
      )}
            chat={<ChatPage />}
          />
        </Route>
      </Switch>
    </>
  ) : (
    <Switch>
      <Route exact path="/register/2fa" component={MFARegisterPage} />
      <Route exact path="/2fa" component={MFAPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route path="/" component={LoginPage} />
    </Switch>
  );

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
