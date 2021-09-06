import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import { asyncGetRequest, makeAPIPath } from '../../../utils/utils';
import List from '../../atoms/List/List';
import ListItem from '../../atoms/ListItem/ListItem';
import SubMenu from '../../molecules/SubMenu/SubMenu';
import ProfileCard, { ProfileCardSkeleton } from '../../organisms/ProfileCard/ProfileCard';
import { RelatedInfoType, RelationshipType, UserInfoType } from '../../../types/User';
import { RawUserInfoType } from '../../../types/Response';
import useDialog from '../../../utils/hooks/useDialog';
import Dialog from '../../molecules/Dialog/Dialog';
import useIntersect from '../../../utils/hooks/useIntersect';

const ALL_PATH = '/community/all';
const FRIEND_PATH = '/community/friend';
const BLOCKED_PATH = '/community/block';

const COUNTS_PER_PAGE = 10;

type ListProps = {
  type: 'friends' | 'blocks' | 'all',
};

type RelationListType = {
  [index: string]: RelationshipType,
};

const relationships: RelationListType = {
  friends: 'FRIEND',
  blocks: 'BLOCKING',
  all: 'NONE',
};

const UserList = ({ type }: ListProps) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const path = type === 'all' ? makeAPIPath('/users') : makeAPIPath(`/${type}`);
  const relationship = relationships[type];
  const [users, setUsers] = useState<RelatedInfoType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(1);
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}`, source)
      .then(({ data }: { data: RawUserInfoType[] }) => {
        const typed: UserInfoType[] = data;
        setUsers((prev) => prev.concat(typed.map((user) => ({ ...user, avatar: makeAPIPath(`/${user.avatar}`), relationship }))));
        if (data.length === 0 || data.length < COUNTS_PER_PAGE) setListEnd(true);
      })
      .catch((error) => {
        source.cancel();
        toast.error(error.message);
        setListEnd(true);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  // eslint-disable-next-line no-unused-vars
  const [_, setRef] = useIntersect(async (entry: any, observer: any) => {
    observer.unobserve(entry.target);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setPage((prev) => prev + 1);
    observer.observe(entry.target);
  });

  useEffect(() => {
    if (type === 'friends') {
      asyncGetRequest(makeAPIPath('/friends?status=REQUESTED&me=REQUESTER'), source)
        .then(({ data }: { data: RawUserInfoType[] }) => {
          const typed: UserInfoType[] = data;
          setUsers(typed.map((oneUser) => ({ ...oneUser, avatar: makeAPIPath(`/${oneUser.avatar}`), relationship: 'REQUESTING' })));
        })
        .catch((error) => { toast.error(error.message); });
      asyncGetRequest(makeAPIPath('/friends?status=REQUESTED&me=ADDRESSEE'), source)
        .then(({ data }: { data: RawUserInfoType[] }) => {
          const typed: UserInfoType[] = data;
          setUsers((prev) => prev.concat(typed.map((oneUser) => ({ ...oneUser, avatar: makeAPIPath(`/${oneUser.avatar}`), relationship: 'REQUESTED' }))));
          setListEnd(false);
        })
        .catch((error) => {
          source.cancel();
          toast.error(error.message);
          setListEnd(true);
        });
    } else setListEnd(false);

    return () => {
      source.cancel();
      setUsers([]);
      setListEnd(false);
    }; // NOTE 메모리 leak 방지 (https://stackoverflow.com/a/65007703/13614207)
  }, []);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      {users.map((user) => (
        <ListItem key={user.id}>
          <ProfileCard
            userInfo={user}
            setUser={(userInfo) => {
              setUsers(users.filter((one) => one.id !== userInfo.id).concat(userInfo));
            }}
            setOpen={setOpen}
            setDialog={setDialog}
          />
        </ListItem>
      ))}
      {!isListEnd && (
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}
        ref={isListEnd ? null : setRef as React.LegacyRef<HTMLDivElement>}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          wrap="nowrap"
          spacing={1}
          xs={12}
        >
          <ListItem><ProfileCardSkeleton /></ListItem>
          <ListItem><ProfileCardSkeleton /></ListItem>
          <ListItem><ProfileCardSkeleton /></ListItem>
        </Grid>
      </div>
      )}
    </>
  );
};

const FriendList = () => <UserList type="friends" />;
const BlockList = () => <UserList type="blocks" />;
const AllList = () => <UserList type="all" />;

const list = [
  { name: 'ALL USERS', link: ALL_PATH },
  { name: 'FRIENDS LIST', link: FRIEND_PATH },
  { name: 'BLOCKED USER', link: BLOCKED_PATH },
];

const CommunityPage = () => (
  <>
    <SubMenu current={window.location.pathname} list={list} />
    <List height="78vh" scroll>
      <Switch>
        <Route exact path={FRIEND_PATH} component={FriendList} />
        <Route exact path={BLOCKED_PATH} component={BlockList} />
        <Route exact path={ALL_PATH} component={AllList} />
        <Route path="/">
          <Redirect to={FRIEND_PATH} />
        </Route>
      </Switch>
    </List>
  </>
);

export default CommunityPage;
