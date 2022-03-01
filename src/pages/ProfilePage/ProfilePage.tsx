import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import {
  List, Typo, ProfileCard, Dialog, MatchListItem, MatchListItemSkeleton,
  AchieveListItem, AchieveListItemSkeleton,
} from '~components/index';
import {
  RelatedInfoType, RawAchievementType, AchievementType, RawMatchType, MatchType,
  initialRawFriendInfo, initialRawUserInfo, RawRelatedInfoType,
} from '~types/index';
import {
  useUserState, useDialog, useAppDispatch, useIntersect, useError,
} from '~hooks/index';
import { asyncGetRequest, makeRelatedInfo } from '~utils/index';

const COUNTS_PER_PAGE = 10;

const initialUserInfo: RelatedInfoType = {
  id: '',
  name: '',
  avatar: '',
  status: 'OFFLINE',
  relationship: 'NONE',
};

type UserNameType = {
  username: string,
};

type MatchParams = {
  username: string,
};

const MatchHistory = ({ username }: UserNameType) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const path = `/users/${username}/matches`;
  const [matchHistories, setMatchHistories] = useState<MatchType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(0);
  const errorMessageHandler = useError();

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}&status=DONE`)
      .then(({ data }: { data: RawMatchType[] }) => {
        const match: MatchType[] = data.map((info) => ({
          ...info,
          createdAt: new Date(info.createdAt),
        }));
        setMatchHistories((prev) => prev.concat(match));
        if (data.length === 0 || data.length < COUNTS_PER_PAGE) setListEnd(true);
      })
      .catch((error) => {
        source.cancel();
        errorMessageHandler(error);
        setListEnd(true);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  // eslint-disable-next-line no-unused-vars
  const [_, setRef] = useIntersect(async (entry: any, observer: any) => {
    observer.unobserve(entry.target);
    await new Promise((resolve) => setTimeout(resolve, 10));
    setPage((prev) => prev + 1);
    observer.observe(entry.target);
  });

  useEffect(() => {
    setListEnd(false);

    return () => {
      source.cancel();
      setMatchHistories([]);
      setListEnd(true);
    };
  }, []);

  return (
    <>
      {matchHistories.map((matchHistory) => (
        <MatchListItem
          opposite={matchHistory.user1.name === username ? matchHistory.user2 : matchHistory.user1}
          mode={matchHistory.mode}
          isMeWinner={matchHistory.winner?.name === username}
          createdAt={matchHistory.createdAt}
          key={matchHistory.id}
        />
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
            <MatchListItemSkeleton />
            <MatchListItemSkeleton />
            <MatchListItemSkeleton />
          </Grid>
        </div>
      )}
    </>
  );
};

const AchievementList = ({ username }: UserNameType) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const [achieves, setAchieves] = useState<AchievementType[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const errorMessageHandler = useError();
  const path = `/users/${username}/achievements`;

  useEffect(() => {
    axios.get(path, { cancelToken: source.token })
      .then((responses) => {
        const { data }: { data: RawAchievementType[] } = responses;
        const Achievements: AchievementType[] = data.map((achieve) => ({
          ...achieve,
          createdAt: new Date(achieve.createdAt),
        }));
        setLoaded(true);
        setAchieves(Achievements);
      })
      .catch((error) => {
        source.cancel();
        errorMessageHandler(error);
        setLoaded(true);
      });

    return () => {
      source.cancel();
      setAchieves([]);
      setLoaded(true);
    };
  }, []);

  return (
    <>
      {achieves.map((achievement) => (
        <AchieveListItem
          info={achievement}
          key={achievement.name}
        />
      ))}
      {!isLoaded && (
        <>
          <AchieveListItemSkeleton />
          <AchieveListItemSkeleton />
          <AchieveListItemSkeleton />
        </>
      )}
    </>
  );
};

const ProfilePage = ({ match }: RouteComponentProps<MatchParams>) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const [user, setUser] = useState<RelatedInfoType | null>(initialUserInfo);
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const { username } = match.params;
  const appDispatch = useAppDispatch();
  const errorMessageHandler = useError();
  const history = useHistory();
  const me = useUserState();

  useEffect(() => {
    const userInfo: RawRelatedInfoType = {
      ...initialRawUserInfo,
      friendship: initialRawFriendInfo,
    };
    appDispatch({ type: 'loading' });
    asyncGetRequest(`/users/${username}`)
      .then(({ data }) => {
        Object.assign(userInfo, data);
        return (
          asyncGetRequest(`/friendships/${username}`)
            .then((response) => {
              Object.assign(userInfo.friendship, response.data);
              setUser(makeRelatedInfo(me, userInfo));
            })
            .catch((error) => {
              source.cancel();
              if (error.response && [404, 409].includes(error.response.status)) {
                userInfo.friendship = null;
                setUser(makeRelatedInfo(me, userInfo));
              } else errorMessageHandler(error);
            }));
      })
      .catch((error) => {
        source.cancel();
        if (error.response?.status === 404) {
          history.push('/404');
        } else errorMessageHandler(error);
      })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      });

    return () => {
      source.cancel();
      setUser(null);
    };
  }, [username]);

  return user ? (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <Grid container direction="column" spacing={4} justifyContent="space-evenly" alignItems="stretch">
        <Grid item>
          <ProfileCard
            userInfo={user}
            setUser={setUser}
            setOpen={setOpen}
            setDialog={setDialog}
            profile
          />
        </Grid>
        <Grid item>
          <Typo variant="h5">Match History</Typo>
          <List height="23vh" scroll>
            <MatchHistory username={username} />
          </List>
        </Grid>
        <Grid item>
          <Typo variant="h5">Achievements</Typo>
          <List height="23vh" scroll>
            <AchievementList username={username} />
          </List>
        </Grid>
      </Grid>
    </>
  ) : <></>;
};

export default ProfilePage;
