import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import MainTemplate from './templates/MainTemplate/MainTemplate';
import ListItem from './atoms/ListItem/ListItem';
import List from './atoms/List/List';
import ChatInput from './atoms/ChatInput/ChatInput';
import { ContextProvider } from '../utils/hooks/useContext';
import Typo from './atoms/Typo/Typo';

export default {
  component: MainTemplate,
  title: 'tests/Chat',
} as Meta;

type ChatType = {
  content: string,
  date: string,
};

const addNewChat = (prev: ChatType[], content: string) => {
  const temp = prev.slice();
  temp.unshift({ content, date: Date.now().toString() });
  return temp;
};

const Chat = () => {
  const [chat, setChat] = useState<ChatType[]>([]);
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <List height="75vh" scroll reverse>
        {chat.map(({ content, date }) => <ListItem key={date}>{content}</ListItem>)}
      </List>
      <ChatInput
        onSubmit={(e) => {
          e.preventDefault();
          if (value === '') return;
          setChat((prev) => addNewChat(prev, value));
          setValue('');
        }}
        onChange={handleChange}
        value={value}
      />
    </>
  );
};

export const ChatTest = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={(
          <>
            <Typo variant="h3" gutterBottom>Chat Test Page</Typo>
            <Typo variant="h5">List</Typo>
            <List />
            <Typo variant="h5">List</Typo>
            <List height="35vh" />
          </>
        )}
        chat={<Chat />}
      />
    </ContextProvider>
  </BrowserRouter>
);
