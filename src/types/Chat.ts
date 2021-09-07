import { UserInfoType } from './User';

export type MembershipRole = 'ADMIN' | 'OWNER' | 'MEMBER' | 'NONE';

export type MessageType = { // 서버의 'message' 이벤트가 emit
  name: string, // channel이나 dm 상대의 name
  id: string, // message의 id
  content: string,
  createdAt: Date,
  user: UserInfoType, // 나 자신일 수도 있음
}; // FIXME TEMP

export type ChannelType = {
  name: string,
  role: MembershipRole,
  unreads: number,
  isLocked: boolean,
  updatedAt: Date,
}; // FIXME TEMP

export type DMRoomType = {
  name: string,
  latestMessage?: MessageType, // FIXME API 추가되면 구현
  unreads: number,
}; // FIXME TEMP
