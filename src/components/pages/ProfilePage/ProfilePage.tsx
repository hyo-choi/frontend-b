import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import List from '../../atoms/List/List';
import Typo from '../../atoms/Typo/Typo';
import ProfileCard from '../../organisms/ProfileCard/ProfileCard';
import Dialog from '../../molecules/Dialog/Dialog';
import useDialog from '../../../utils/hooks/useDialog';
import MatchListItem, { MatchListItemSkeleton } from '../../organisms/MatchListItem/MatchListItem';
import AchieveListItem, { AchieveListItemSkeleton } from '../../organisms/AchieveListItem/AchieveListItem';
import { RelatedInfoType } from '../../../types/User';
import { useUserState } from '../../../utils/hooks/useUserContext';
import { useAppDispatch } from '../../../utils/hooks/useAppContext';
import { asyncGetRequest, errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import { makeRelatedInfo } from '../../../utils/friendships';
import { initialRawFriendInfo, initialRawUserInfo, RawRelatedInfoType } from '../../../types/Response';
import { RawAchievementType, AchievementType } from '../../../types/Game';
import { RawMatchType, MatchType } from '../../../types/Match';
import useIntersect from '../../../utils/hooks/useIntersect';

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
  const path = makeAPIPath(`/users/${username}/matches`);
  const [matchHistories, setMatchHistories] = useState<MatchType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(0);

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}&status=DONE`, source)
      .then(({ data }: { data: RawMatchType[] }) => {
        const match: MatchType[] = data.map((info) => ({
          ...info,
          createdAt: new Date(info.createdAt),
          user1: { ...info.user1, avatar: makeAPIPath(`/${info.user1.avatar}`) },
          user2: { ...info.user2, avatar: makeAPIPath(`/${info.user2.avatar}`) },
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
  const path = makeAPIPath(`/users/${username}/achievements`);

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
  const history = useHistory();
  const me = useUserState();

  useEffect(() => {
    const userInfo: RawRelatedInfoType = {
      ...initialRawUserInfo,
      friendship: initialRawFriendInfo,
    };
    appDispatch({ type: 'loading' });
    asyncGetRequest(makeAPIPath(`/users/${username}`), source)
      .then(({ data }) => {
        Object.assign(userInfo, data);
        return (
          asyncGetRequest(makeAPIPath(`/friendships/${username}`), source)
            .then((response) => {
              Object.assign(userInfo.friendship, response.data);
              setUser(makeRelatedInfo(me, userInfo));
            })
            .catch((error) => {
              source.cancel();
              if (error.response && [404, 409].includes(error.response.status)) {
                userInfo.friendship = null;
                setUser(makeRelatedInfo(me, userInfo));
              } else toast.error(error.message);
            }));
      })
      .catch((error) => {
        source.cancel();
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          history.push('/404');
        } else {
          toast.error(error.message);
        }
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
