import React, {
  createContext, useReducer, useContext, Dispatch,
} from 'react';
import { MyInfoType } from '../../types/User';

const initialUserState: MyInfoType = {
  id: '',
  name: '',
  avatar: '',
  enable2FA: false,
  authenticatorSecret: false,
  isSecondFactorAuthenticated: false,
};

type UserActionType = { type: 'login', info: MyInfoType } | { type: 'logout' }
                    | { type: 'reset' } | { type: 'edit', info: MyInfoType };

type AppStateType = {
  isLoading: boolean,
};

const initialAppState: AppStateType = {
  isLoading: false,
};

type AppActionType = { type: 'loading' } | { type: 'endLoading' };

const AppStateContext = createContext<AppStateType | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppActionType> | undefined>(undefined);

const UserStateContext = createContext<MyInfoType | undefined>(undefined);
const UserDispatchContext = createContext<Dispatch<UserActionType> | undefined>(undefined);

function UserReducer(state: MyInfoType, action: UserActionType): MyInfoType {
  switch (action.type) {
    case 'login':
      return { ...action.info };
    case 'edit':
      return { ...state, ...action.info };
    case 'logout':
    case 'reset':
    default:
      return { ...initialUserState };
  }
}

function AppReducer(state: AppStateType, action: AppActionType): AppStateType {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'endLoading':
      return { ...state, isLoading: false };
    default:
      return { ...state };
  }
}

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
  const [appState, appDispatch] = useReducer(AppReducer, initialAppState);
  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={appDispatch}>
        <UserStateContext.Provider value={userState}>
          <UserDispatchContext.Provider value={userDispatch}>
            {children}
          </UserDispatchContext.Provider>
        </UserStateContext.Provider>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

function useUserState() {
  const state = useContext(UserStateContext);
  if (!state) {
    throw new Error('Provider not found');
  }
  return (state);
}

function useUserDispatch() {
  const dispatch = useContext(UserDispatchContext);
  if (!dispatch) {
    throw new Error('Provider not found');
  }
  return (dispatch);
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

export {
  ContextProvider, useUserState, useUserDispatch, useAppDispatch, useAppState,
};
