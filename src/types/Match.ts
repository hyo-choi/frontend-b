import { RawUserInfoType } from './Response';
import { UserInfoType } from './User';

export type MatchStatusType = 'IN_PROGRESS' | 'DONE';

export type MatchGameType = 'LADDER' | 'EXHIBITION';

export type GameModeType = 'CLASSIC' | 'SPEED' | 'REVERSE';

export type MatchPositionType = 'LEFT' | 'RIGHT' | 'WATCH';

export type RawMatchType = {
  id: string,
  createdAt: string,
  status: MatchStatusType,
  type: MatchGameType,
  mode: GameModeType,
  user1: RawUserInfoType & { score: number },
  user2: RawUserInfoType & { score: number },
  winner: RawUserInfoType | null,
  loser: RawUserInfoType | null,
};

export type MatchType = {
  id: string,
  createdAt: Date,
  type: MatchGameType,
  mode: GameModeType,
  user1: UserInfoType & { score: number },
  user2: UserInfoType & { score: number },
  winner: UserInfoType | null,
  loser: UserInfoType | null,
}

export type ReadyEventType = {
  position: MatchPositionType,
  user1: RawUserInfoType,
  user2: RawUserInfoType,
  setting: any,
};
