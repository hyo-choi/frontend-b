/**
 * UserStatusType
 * @description 유저의 접속 상태 종류
 */
export type UserStatusType = 'ONLINE' | 'OFFLINE' | 'IN_GAME';

/**
 * FriendshipType
 * @description 관계 table상 관계 종류
 */
export type FriendshipType = 'ACCEPTED' | 'DECLINED' | 'REQUESTED' | 'BLOCKED';

/**
 * RelationshipType
 * @description 프론트엔드에서 후처리한 관계 종류
 */
export type RelationshipType = 'NONE' | 'FRIEND' | 'REQUESTING' | 'REQUESTED' | 'BLOCKING' | 'BLOCKED';

/**
 * MyInfoType
 * @description RawUserInfoType을 후처리한 본인(로그인한 유저) 정보 타입
 * - id: user의 id
 */
export type MyInfoType = {
  id: string,
  name: string,
  avatar: string,
  enable2FA: boolean,
  authenticatorSecret: boolean,
  isSecondFactorAuthenticated: boolean,
};

/**
 * UserInfoType
 * @description RawUserInfoType을 후처리한 타인 정보 타입
 * - id: user의 id
 */
export type UserInfoType = {
  id: string,
  name: string,
  avatar: string,
  status: UserStatusType,
};

/**
 * FriendInfoType
 * @description RawFriendInfoType을 후처리한 정보 타입
 */
export type FriendInfoType = {
  status: FriendshipType,
  updatedAt: Date,
  requester: UserInfoType,
  addressee: UserInfoType,
};

/**
 * RelatedInfoType
 * @description RawRelatedInfoType을 후처리한 정보 타입
 * - id: user의 id
 */
export type RelatedInfoType = UserInfoType & {
  relationship: RelationshipType,
};
