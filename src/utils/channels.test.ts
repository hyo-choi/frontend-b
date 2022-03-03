import {
  MemberType, RawChannelType, UserInfoType, MembershipType,
} from '~types/index';
import { getMembership, makeChannelInfo } from './channels';

const USER: UserInfoType = {
  id: 'user-e29b-41d4-a716-446655440000',
  name: 'forTest',
  avatar: '',
  status: 'OFFLINE',
};

const MEMBERSHIP_NONE: MembershipType[] = [
  { role: 'NONE', createdAt: new Date().toDateString(), unmutedAt: null },
];

const MEMBERSHIP_OWNER: MembershipType[] = [
  { role: 'OWNER', createdAt: new Date().toDateString(), unmutedAt: null },
];

const MEMBERSHIP_ADMIN: MembershipType[] = [
  { role: 'ADMIN', createdAt: new Date().toDateString(), unmutedAt: null },
];

const MEMBERSHIP_MEMBER: MembershipType[] = [
  { role: 'MEMBER', createdAt: new Date().toDateString(), unmutedAt: null },
];

const MEMBERSHIP_BANNED: MembershipType[] = [
  { role: 'BANNED', createdAt: new Date().toDateString(), unmutedAt: null },
];

describe('getMembership function', () => {
  const members: MemberType[] = [
    {
      ...USER,
      memberships: MEMBERSHIP_NONE,
    },
  ];

  it('should return "NONE"', () => {
    expect(getMembership(USER, [])).toEqual('NONE');
  });

  it('should return "NONE"', () => {
    expect(getMembership(USER, members)).toEqual('NONE');
  });

  it('should return "OWNER"', () => {
    members[0].memberships = MEMBERSHIP_OWNER;
    expect(getMembership(USER, members)).toEqual('OWNER');
  });

  it('should return "ADMIN"', () => {
    members[0].memberships = MEMBERSHIP_ADMIN;
    expect(getMembership(USER, members)).toEqual('ADMIN');
  });

  it('should return "MEMBER"', () => {
    members[0].memberships = MEMBERSHIP_MEMBER;
    expect(getMembership(USER, members)).toEqual('MEMBER');
  });

  it('should return "BANNED"', () => {
    members[0].memberships = MEMBERSHIP_BANNED;
    expect(getMembership(USER, members)).toEqual('BANNED');
  });
});

describe('makeChannelInfo function', () => {
  const rawData: RawChannelType = {
    id: 'channel-e29b-41d4-a716-446655440000',
    name: 'sample',
    password: null,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    memberships: [],
  };

  const result = {
    id: rawData.id,
    name: rawData.name,
    updatedAt: new Date(rawData.updatedAt),
    unreads: 0,
    isLocked: false,
    role: 'NONE',
  };

  it('returns a public channel info', () => {
    expect(makeChannelInfo(rawData)).toEqual(result);
  });

  it('returns a private channel info', () => {
    expect(makeChannelInfo({ ...rawData, password: 'HIDDEN' })).toEqual({
      ...result,
      isLocked: true,
    });
  });

  it('returns a channel info (none)', () => {
    expect(makeChannelInfo({ ...rawData, memberships: MEMBERSHIP_NONE })).toEqual(result);
  });

  it('returns a channel info (owner)', () => {
    expect(makeChannelInfo({ ...rawData, memberships: MEMBERSHIP_OWNER })).toEqual({
      ...result,
      role: 'OWNER',
    });
  });

  it('returns a channel info (admin)', () => {
    expect(makeChannelInfo({ ...rawData, memberships: MEMBERSHIP_ADMIN })).toEqual({
      ...result,
      role: 'ADMIN',
    });
  });

  it('returns a channel info (member)', () => {
    expect(makeChannelInfo({ ...rawData, memberships: MEMBERSHIP_MEMBER })).toEqual({
      ...result,
      role: 'MEMBER',
    });
  });

  it('returns a channel info (banned)', () => {
    expect(makeChannelInfo({ ...rawData, memberships: MEMBERSHIP_BANNED })).toEqual({
      ...result,
      role: 'BANNED',
    });
  });
});
