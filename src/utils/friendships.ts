import { RawRelatedInfoType } from '../types/Response';
import {
  FriendshipType, MyInfoType, RelatedInfoType, RelationshipType,
} from '../types/User';
import { makeAPIPath } from './utils';

const makeRelationship = (isMeRequester: boolean, status: FriendshipType): RelationshipType => {
  switch (status) {
    case 'ACCEPTED':
      return 'FRIEND';
    case 'REQUESTED':
      return isMeRequester ? 'REQUESTING' : 'REQUESTED';
    case 'BLOCKED':
      return isMeRequester ? 'BLOCKING' : 'BLOCKED';
    case 'DECLINED':
    default:
      return 'NONE';
  }
};

const makeRelatedInfo = (me: MyInfoType, rawData: RawRelatedInfoType): RelatedInfoType => {
  const {
    id, name, avatar, status, friendship,
  } = rawData;
  const result: RelatedInfoType = {
    id,
    name,
    avatar: makeAPIPath(`/${avatar}`),
    status,
    relationship: 'NONE',
  };

  if (!friendship) return result;

  const isMeRequester: boolean = friendship.requester.id === me.id;
  result.relationship = makeRelationship(isMeRequester, friendship.status);
  return result;
};

export { makeRelatedInfo, makeRelationship };
