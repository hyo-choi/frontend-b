import { FriendshipType, UserStatusType } from './User';

/**
 * RawUserInfoType
 * @description API에서 얻을 수 있는 응답 형식
 * - id: user의 id
 * ### API Endpoint
 * - GET /users/me
 * - GET /users
 */
export type RawUserInfoType = {
  id: string,
  name: string,
  avatar: string,
  status: UserStatusType,
  enable2FA: boolean,
  authenticatorSecret: boolean,
  isSecondFactorAuthenticated: boolean,
  win?: number,
  lose?: number,
  score?: number,
};

export const initialRawUserInfo: RawUserInfoType = {
  id: '',
  name: '',
  avatar: '',
  status: 'OFFLINE',
  enable2FA: false,
  authenticatorSecret: false,
  isSecondFactorAuthenticated: false,
};

/**
 * RawFriendInfoType
 * @description API에서 얻을 수 있는 응답 형식
 * ### API Endpoint
 * - GET /friendship
 */
export type RawFriendInfoType = {
  status: FriendshipType,
  updatedAt: Date,
  requester: RawUserInfoType,
  addressee: RawUserInfoType,
};

export const initialRawFriendInfo: RawFriendInfoType = {
  status: 'DECLINED',
  updatedAt: new Date(),
  requester: initialRawUserInfo,
  addressee: initialRawUserInfo,
};

/**
 * RawRelatedInfoType
 * @description API에서 받아온 raw한 user 정보 타입
 * - id: user의 id
 */
export type RawRelatedInfoType = RawUserInfoType & {
  friendship: null | RawFriendInfoType,
};
