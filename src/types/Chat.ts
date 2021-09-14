import { RawUserInfoType } from './Response';
import { UserInfoType } from './User';

export type MembershipRole = 'ADMIN' | 'OWNER' | 'MEMBER' | 'NONE' | 'BANNED';

type MembershipType = {
  role: MembershipRole,
  createdAt: string,
  unmutedAt: string | null,
};

export type MemberType = UserInfoType & { memberships: MembershipType[] };

export type RawChannelType = {
  id: string,
  name: string,
  password: 'HIDDEN' | null,
  createdAt: string,
  updatedAt: string,
  memberships: MembershipType[],
};

export type RawMessageType = {
  content: string,
  user: UserInfoType,
  channel: RawChannelType,
  id: string, // message의 id
  createdAt: Date,
};

export type RawDMType = {
  content: string,
  receiver: RawUserInfoType,
  sender: RawUserInfoType,
  id: string, // message의 id
  createdAt: Date,
};

export type MessageType = {
  type: 'channel' | 'DM',
  content: string,
  user: UserInfoType,
  name: string,
  id: string, // message의 id
  createdAt: Date,
};

export type ChannelType = {
  id: string,
  name: string,
  role: MembershipRole,
  unreads: number,
  isLocked: boolean,
  updatedAt: Date,
};

export type DMRoomType = UserInfoType & { latestMessage: MessageType, unreads: number };
