import React from 'react';
import { AppContextProvider } from './useAppContext';
import { GameContextProvider } from './useGameContext';
import { UserContextProvider } from './useUserContext';

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <UserContextProvider>
        <GameContextProvider>
          {children}
        </GameContextProvider>
      </UserContextProvider>
    </AppContextProvider>
  );
}
