import React, {
  createContext, useReducer, useContext, Dispatch,
} from 'react';
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';
import { ChannelType, DMRoomType, MessageType } from '../../types/Chat';
import { UserInfoType } from '../../types/User';
import { asyncGetRequest } from '../utils';

type ChattingType = {
  type: 'channel' | 'DM',
  name: string,
};

type AppStateType = {
  isLoading: boolean,
  socket: Socket | null,
  chatting: ChattingType | null,
  newMessage: MessageType | null,
  channels: ChannelType[],
  DMs: DMRoomType[],
  blockList: string[],
};

const initialAppState: AppStateType = {
  isLoading: false,
  socket: null,
  chatting: null,
  newMessage: null,
  channels: [],
  DMs: [],
  blockList: [],
};

type AppActionType =
  { type: 'loading' } |
  { type: 'endLoading' } |
  { type: 'connect', socket: Socket } |
  { type: 'renewBlockList', list: string[] } |
  { type: 'join', channels?: ChannelType[], DMs?: DMRoomType[] } |
  { type: 'exit', name: string } |
  { type: 'enterChat', chatting: ChattingType } |
  { type: 'leaveChat' } |
  { type: 'newMessage', message: MessageType } |
  { type: 'disconnect' };

const AppStateContext = createContext<AppStateType | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppActionType> | undefined>(undefined);

const newMessageReducer = (state: AppStateType, message: MessageType): AppStateType => {
  const ret = { ...state };

  if (state.chatting?.type === message.type && message.name === state.chatting.name) {
    ret.newMessage = message;
  } else ret.newMessage = null;

  if (message.type === 'channel') {
    ret.channels = state.channels.map((channel: ChannelType) => {
      if (channel.name === message.name && channel.name !== state.chatting?.name) {
        return { ...channel, unreads: channel.unreads + 1 };
      } return { ...channel };
    });
  } else if (state.DMs.some((dmRoom) => dmRoom.name === message.name)) { // 기존 DM
    ret.DMs = state.DMs.map((dmRoom: DMRoomType) => {
      if (dmRoom.name === message.name) { // 나와 dm 상대방의 dm방에 도착한 dm
        if (dmRoom.name !== state.chatting?.name) { // 열려있는 채팅일때
          return { ...dmRoom, unreads: dmRoom.unreads + 1, latestMessage: message };
        } return { ...dmRoom, unreads: 0, latestMessage: message }; // 열려있지 않은 채팅일때
      } return { ...dmRoom };
    });
  } else { // 처음 받거나 보낸 DM
    let userInfo : UserInfoType | null = null;
    if (message.user.name === message.name) userInfo = message.user;
    else {
      asyncGetRequest('/users/me')
        .then(({ data }) => { userInfo = data; })
        .catch((error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message[0]);
          } else toast.error(error.message);
        });
    }
    ret.DMs = state.DMs.concat({
      ...userInfo!,
      latestMessage: message,
      unreads: message.user.name === message.name ? 1 : 0,
    });
  }
  return ret;
};

function AppReducer(state: AppStateType, action: AppActionType): AppStateType {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'endLoading':
      return { ...state, isLoading: false };
    case 'connect':
      return { ...state, socket: action.socket };
    case 'disconnect':
      state?.socket?.disconnect();
      return { ...state, socket: null };
    case 'renewBlockList':
      return { ...state, blockList: action.list };
    case 'enterChat':
      return {
        ...state,
        chatting: action.chatting,
        channels: state.channels.map((channel: ChannelType) => {
          if (action.chatting.type === 'channel' && channel.name === action.chatting.name) {
            return { ...channel, unreads: 0 };
          } return { ...channel };
        }),
        DMs: state.DMs.map((dmRoom: DMRoomType) => {
          if (action.chatting.type === 'DM' && dmRoom.name === action.chatting.name) {
            return { ...dmRoom, unreads: 0 };
          } return { ...dmRoom };
        }),
      };
    case 'leaveChat':
      return { ...state, chatting: null };
    case 'join':
      return {
        ...state,
        channels: action.channels || state.channels,
        DMs: action.DMs || state.DMs,
      };
    case 'exit':
      state?.socket?.emit('leaveRoom', { id: state?.channels?.find((one) => one.name === action.name)?.id });
      return {
        ...state,
        chatting: state?.chatting?.name === action.name ? null : state.chatting,
        channels: state.channels.filter((one) => one.name !== action.name) || state.channels,
      };
    case 'newMessage':
      return newMessageReducer(state, action.message);
    default:
      return { ...state };
  }
}

function useAppState() {
  const state = useContext(AppStateContext);
  if (!state) {
    throw new Error('Provider not found');
  }
  return (state);
}

function useAppDispatch() {
  const dispatch = useContext(AppDispatchContext);
  if (!dispatch) {
    throw new Error('Provider not found');
  }
  return (dispatch);
}

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [appState, appDispatch] = useReducer(AppReducer, initialAppState);
  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={appDispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export {
  AppContextProvider, useAppDispatch, useAppState,
};
