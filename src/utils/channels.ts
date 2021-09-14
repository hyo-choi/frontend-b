/* eslint-disable arrow-body-style */
import {
  ChannelType, RawChannelType, DMRoomType, MembershipRole, MemberType,
} from '../types/Chat';
import { UserInfoType } from '../types/User';

const getMembership = (user: UserInfoType, members: MemberType[]): MembershipRole => {
  const found = members.find((member) => (member.name === user.name));
  if (!found) return 'NONE';
  return found.memberships[0].role;
};

const makeChannelInfo = (rawData: RawChannelType): ChannelType => {
  const {
    id, name, password, updatedAt, memberships,
  } = rawData;
  return {
    id,
    name,
    updatedAt: new Date(updatedAt),
    unreads: 0,
    isLocked: password !== null,
    role: memberships[0] ? memberships[0].role : 'NONE',
  };
};

type ChannelDM = ChannelType | DMRoomType;

const renewUnreads = (innerState: ChannelDM[], appState: ChannelDM[]): ChannelDM[] => {
  return (innerState.map((one) => {
    const copy = { ...one };
    const found = appState.filter((appOne) => appOne.name === copy.name);
    if (found[0]) copy.unreads = found[0].unreads;
    return copy;
  }));
};

const getUnreads = (state: ChannelDM[]): number => {
  return (state.reduce((prev, cur) => prev + cur.unreads, 0));
};

export {
  getMembership, makeChannelInfo, renewUnreads, getUnreads,
};
