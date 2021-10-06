import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAppDispatch, useAppState } from '../../../utils/hooks/useAppContext';
import { asyncGetRequest, errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import ChatInput from '../../atoms/ChatInput/ChatInput';
import List from '../../atoms/List/List';
import Typo from '../../atoms/Typo/Typo';
import {
  MemberType, MessageType, RawDMType, RawMessageType,
} from '../../../types/Chat';
import { useUserState } from '../../../utils/hooks/useUserContext';
import Dialog from '../../molecules/Dialog/Dialog';
import useDialog from '../../../utils/hooks/useDialog';
import ChatMessage from '../../organisms/ChatMessage/ChatMessage';
import useIntersect from '../../../utils/hooks/useIntersect';
import { DMToMessage, messageToMessage } from '../../../utils/chats';
import Button from '../../atoms/Button/Button';
import { getMembership } from '../../../utils/channels';
import { PLAY_PATH } from '../../../utils/path';

const COUNTS_PER_PAGE = 20;

const postChannelChat = (name: string, content: string) => (axios.post(makeAPIPath(`/channels/${name}/chats`), { content }));
const postDM = (name: string, content: string) => (axios.post(makeAPIPath('/dms'), { name, content }));

const addNewChat = (prev: MessageType[], message: MessageType) => {
  const temp = prev.slice();
  temp.unshift(message);
  return temp;
};

const ChatPage = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const userState = useUserState();
  const container = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<MessageType[]>([]);
  const [chat, setChat] = useState<string>('');
  const [isChatEnd, setChatEnd] = useState(false);
  const [page, setPage] = useState<number>(0);
  const isSending = useRef<boolean>(false);
  const [members, setMembers] = useState<MemberType[]>([]);
  const {
    chatting, newMessage, blockList,
  } = useAppState();
  const appDispatch = useAppDispatch();
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChat(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chat.length === 0 || isSending.current) return;

    isSending.current = true;
    (chatting?.type === 'channel' ? postChannelChat(chatting!.name, chat) : postDM(chatting!.name, chat))
      .finally(() => setChat(''))
      .then(() => {})
      .catch((error) => {
        isSending.current = false;
        errorMessageHandler(error);
      });
  };

  const fetchItems = () => {
    if (!chatting || isChatEnd) return;
    const path = chatting.type === 'channel' ? makeAPIPath(`/channels/${chatting.name}/chats`) : makeAPIPath(`/dms/opposite/${chatting.name}`);

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}`, source)
      .then(({ data }) => {
        const typed: MessageType[] = data
          .map((one: RawMessageType | RawDMType) => (
            chatting.type === 'channel' ? messageToMessage(one as RawMessageType, chatting!.name)
              : DMToMessage(one as RawDMType, userState.name)));
        setChats((prev) => prev.concat(typed));
        if (data.length === 0 || data.length < COUNTS_PER_PAGE) setChatEnd(true);
      })
      .catch((error) => {
        source.cancel();
        errorMessageHandler(error);
        setChatEnd(true);
      });
  };

  useEffect(() => {
    setChats([]);
    isSending.current = false;
    setChat('');
    setPage(chatting ? 1 : 0);
    setChatEnd(!chatting);
    source.cancel();
    if (chatting && chatting.type === 'channel') {
      asyncGetRequest(makeAPIPath(`/channels/${chatting.name}/members`))
        .then(({ data }) => { setMembers(data); })
        .catch((error) => { errorMessageHandler(error); });
    } else setMembers([]);
  }, [chatting]);

  useEffect(() => {
    fetchItems();
  }, [page]);

  useEffect(() => {
    if (isSending.current && newMessage) {
      if (newMessage.user.id === userState.id) {
        isSending.current = false;
        setChat('');
      }
    }
  }, [isSending.current]);

  useEffect(() => {
    if (newMessage) {
      setChats((prev) => addNewChat(prev, newMessage));
    }
  }, [newMessage]);

  useEffect(() => {
    if (location.pathname === PLAY_PATH) setOpen(false);
  }, [location.pathname]);

  useEffect(() => () => {
    source.cancel();
    setChats([]);
    setMembers([]);
    setChatEnd(true);
    isSending.current = false;
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [_, setRef] = useIntersect(async (entry: any, observer: any) => {
    observer.unobserve(entry.target);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setPage((prev) => prev + 1);
    observer.observe(entry.target);
  });

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
        container={() => container.current}
      />
      <Grid container justifyContent="space-between" alignItems="center">
        <Typo variant="h6">{chatting?.name || '참여중인 채팅이 없습니다'}</Typo>
        {chatting && <Button variant="text" onClick={() => appDispatch({ type: 'leaveChat' })}>채팅 닫기</Button>}
      </Grid>
      {chatting ? (
        <>
          <List height="70vh" ref={container} reverse scroll>
            {chats.map((one) => (chatting.type === 'channel' && blockList.includes(one.user.name) ? <></>
              : (
                <ChatMessage
                  key={one.id}
                  info={one}
                  userRole={chatting.type === 'channel' ? getMembership(one.user, members) : 'MEMBER'}
                  me={one.user.name === userState.name}
                  setOpen={setOpen}
                  setDialog={setDialog}
                />
              )
            ))}
            {!isChatEnd && (
            <div
              style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}
              ref={isChatEnd ? null : setRef as React.LegacyRef<HTMLDivElement>}
            >
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                wrap="nowrap"
                spacing={1}
                xs={12}
              >
                <Typo gutterBottom>Loading...</Typo>
              </Grid>
            </div>
            )}
          </List>
          <ChatInput value={chat} onChange={handleChange} onSubmit={handleSubmit} />
          <LinearProgress style={{ visibility: isSending.current ? 'visible' : 'hidden' }} />
        </>
      )
        : (
          <List height="70vh">
            <Grid style={{ height: '100%' }} container item justifyContent="center" alignItems="center">
              <Typo>채팅에 참여해보세요!</Typo>
            </Grid>
          </List>
        )}
    </>
  );
};

export default ChatPage;
