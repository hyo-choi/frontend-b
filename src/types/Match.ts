import { RawUserInfoType } from './Response';

export type MatchStatusType = 'IN_PROGRESS' | 'DONE';

export type MatchGameType = 'LADDER' | 'EXHIBITON';

export type GameModeType = 'CLASSIC' | 'SPEED' | 'REVERSE';

export type RawMatchType = {
  id: string,
  createdAt: string,
  status: MatchStatusType,
  type: MatchGameType,
  mode: GameModeType,
  user1: RawUserInfoType & { score: number },
  user2: RawUserInfoType & { score: number },
};

export type MatchType = {
  id: string,
  type: MatchGameType,
  mode: GameModeType,
  user1: RawUserInfoType & { score: number },
  user2: RawUserInfoType & { score: number },
}
