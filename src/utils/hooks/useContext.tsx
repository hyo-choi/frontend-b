import React from 'react';
import { AppContextProvider } from './useAppContext';
import { UserContextProvider } from './useUserContext';

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </AppContextProvider>
  );
}
