import { MessageType, RawDMType, RawMessageType } from '~types/Chat';

const messageToMessage = (
  message: RawMessageType,
  channelName?: string,
): MessageType => {
  const {
    content, user, id, createdAt,
  } = message;
  return {
    type: 'channel',
    content,
    user,
    id,
    createdAt: new Date(createdAt),
    name: channelName || message.channel.name,
  };
};

const DMToMessage = (message: RawDMType, myName: string): MessageType => {
  const {
    content, id, createdAt, receiver, sender,
  } = message;
  return {
    type: 'DM',
    content,
    user: { ...sender },
    id,
    createdAt: new Date(createdAt),
    name: receiver.name === myName ? sender.name : receiver.name,
  };
};

export { messageToMessage, DMToMessage };
