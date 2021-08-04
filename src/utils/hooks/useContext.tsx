import React, {
  createContext, useReducer, useContext, Dispatch,
} from 'react';

export interface UserStateType {
  id: string,
  name: string,
  avatar: string,
}

const initialState: UserStateType = {
  id: '',
  name: '',
  avatar: '',
};

type UserActionType = { type: 'login', info: UserStateType } | { type: 'logout' }
                    | { type: 'reset' };

const StateContext = createContext<UserStateType | undefined>(undefined);
const DispatchContext = createContext<Dispatch<UserActionType> | undefined>(undefined);

function reducer(state: UserStateType, action: UserActionType): UserStateType {
  switch (action.type) {
    case 'login':
      return { ...action.info };
    case 'logout':
    case 'reset':
    default:
      return { ...initialState };
  }
}

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useUserState() {
  const state = useContext(StateContext);
  if (!state) {
    throw new Error('Provider not found');
  }
  return (state);
}

function useDispatch() {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) {
    throw new Error('Provider not found');
  }
  return (dispatch);
}

export {
  ContextProvider, useUserState, useDispatch,
};
