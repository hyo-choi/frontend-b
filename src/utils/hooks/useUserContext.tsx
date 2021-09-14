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

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
  return (
    <UserStateContext.Provider value={userState}>
      <UserDispatchContext.Provider value={userDispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
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

export {
  UserContextProvider, useUserState, useUserDispatch,
};
