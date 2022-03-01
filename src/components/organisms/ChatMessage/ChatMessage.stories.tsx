import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid/Grid';
import { MessageType } from '~types/Chat';
import List from '~components/atoms/List/List';
import ContextProvider from '~hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import Typo from '~components/atoms/Typo/Typo';
import ChatMessage from './ChatMessage';
import Dialog from '../../molecules/Dialog/Dialog';
import useDialog, { SetOpenType, SetDialogType } from '~hooks/useDialog';

export default {
  title: 'organisms/ChatMessage',
  component: ChatMessage,
} as Meta;

const shortMessage: MessageType = {
  type: 'channel',
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  content: 'Lorem ipsum dolor sit amet',
  createdAt: new Date(),
  user: {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'USERNAME',
    avatar: '',
    status: 'OFFLINE',
  },
  name: 'temp',
};

const longMessage: MessageType = {
  type: 'channel',
  id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  createdAt: new Date(),
  user: {
    id: '550e8400-e29b-41d4-a716-446655440000', // 의미없는 uuid입니다
    name: 'USERNAME',
    avatar: '',
    status: 'OFFLINE',
  },
  name: 'temp',
};

export const Default = () => (
  <>
    <Typo variant="h5" gutterBottom align="center">OWNER</Typo>
    <Grid container>
      <ChatMessage
        info={{ ...shortMessage, user: { ...shortMessage.user, name: 'OWNER' } }}
        userRole="OWNER"
        setOpen={() => {}}
        setDialog={() => {}}
      />
    </Grid>
    <Typo variant="h5" gutterBottom align="center">ADMIN</Typo>
    <Grid container>
      <ChatMessage
        info={{ ...longMessage, user: { ...longMessage.user, name: 'ADMIN' } }}
        userRole="ADMIN"
        setOpen={() => {}}
        setDialog={() => {}}
      />
    </Grid>
    <Typo variant="h5" gutterBottom align="center">MEMBER</Typo>
    <Grid container>
      <ChatMessage
        info={{ ...longMessage, user: { ...longMessage.user, name: 'MEMBER' } }}
        userRole="MEMBER"
        setOpen={() => {}}
        setDialog={() => {}}
      />
    </Grid>
    <Typo variant="h5" gutterBottom align="center">ME</Typo>
    <Grid container>
      <ChatMessage
        info={longMessage}
        userRole="OWNER"
        setOpen={() => {}}
        setDialog={() => {}}
        me
      />
    </Grid>
  </>
);

type WithListProps = {
  setOpen: SetOpenType,
  setDialog: SetDialogType,
};

export const WithList = ({ setOpen, setDialog }: WithListProps) => (
  <List height="78vh" scroll reverse>
    <ChatMessage
      info={shortMessage}
      userRole="MEMBER"
      setOpen={setOpen}
      setDialog={setDialog}
    />
    <ChatMessage
      info={{ ...shortMessage, user: { ...shortMessage.user, name: 'OWNER' } }}
      userRole="OWNER"
      setOpen={setOpen}
      setDialog={setDialog}
    />
    <ChatMessage
      info={shortMessage}
      userRole="ADMIN"
      setOpen={setOpen}
      setDialog={setDialog}
      me
    />
    <ChatMessage
      info={{ ...longMessage, user: { ...longMessage.user, name: 'ADMIN' } }}
      userRole="ADMIN"
      setOpen={setOpen}
      setDialog={setDialog}
    />
    <ChatMessage
      info={shortMessage}
      userRole="OWNER"
      setOpen={setOpen}
      setDialog={setDialog}
      me
    />
    <ChatMessage
      info={longMessage}
      userRole="OWNER"
      setOpen={setOpen}
      setDialog={setDialog}
      me
    />
    <ChatMessage
      info={{ ...longMessage, user: { ...longMessage.user, name: 'MEMBER' } }}
      userRole="MEMBER"
      setOpen={setOpen}
      setDialog={setDialog}
    />
  </List>
);

WithList.args = {
  setOpen: () => {},
  setDialog: () => {},
};

export const WithMainTemplate = () => {
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  return (
    <BrowserRouter>
      <ContextProvider>
        <Dialog
          title={dialog.title}
          content={dialog.content}
          buttons={dialog.buttons}
          isOpen={isOpen}
          onClose={dialog.onClose}
        />
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
          chat={<WithList setOpen={setOpen} setDialog={setDialog} />}
        />
      </ContextProvider>
    </BrowserRouter>
  );
};
