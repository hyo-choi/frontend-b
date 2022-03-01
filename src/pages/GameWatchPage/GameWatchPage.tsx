import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Redirect, Route, Switch, useLocation,
} from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { asyncGetRequest } from '~utils/index';
import { RawMatchType, MatchType, GameModeType } from '~types/index';
import {
  List, SubMenu, GameListItem, GameListItemSkeleton,
} from '~components/index';
import {
  useAppState, useIntersect, useMatch, DialogProps, useGameDispatch, useError,
} from '~hooks/index';

const ALL_MATCH_PATH = '/game/watch/all';
const LADDER_MATCH_PATH = '/game/watch/ladder';
const EXHIBITION_MATCH_PATH = '/game/watch/exhibition';

const COUNTS_PER_PAGE = 10;

type ListProps = {
  type: 'ALL' | 'LADDER' | 'EXHIBITION',
}

// eslint-disable-next-line no-unused-vars
const dummySetOpen = (value: boolean) => {};
// eslint-disable-next-line no-unused-vars
const dummySetDialog = (value: DialogProps) => {};

const MatchList = ({ type }: ListProps) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const path = '/matches?status=IN_PROGRESS';
  const typePath = type === 'ALL' ? '' : `&type=${type}`;
  const { socket } = useAppState();
  const gameDispatch = useGameDispatch();
  const errorMessageHandler = useError();
  const { handleReady } = useMatch(dummySetOpen, dummySetDialog);
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(0);

  const handleWatch = (mode: GameModeType, matchId: string) => {
    gameDispatch({
      type: 'setGame',
      mode,
      gameType: 'EXHIBITION',
      isPlayer: false,
    });
    socket?.emit('watchMatch', { id: matchId });
    socket?.on('ready', handleReady);
  };

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}&perPage=${COUNTS_PER_PAGE}&page=${page}${typePath}`)
      .then(({ data }: { data: RawMatchType[] }) => {
        const typed: MatchType[] = data.map((match) => ({
          ...match,
          createdAt: new Date(match.createdAt),
        }));
        setMatches((prev) => prev.concat(typed));
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
      socket?.off('ready');
      source.cancel();
      setMatches([]);
      setListEnd(true);
    };
  }, []);

  return (
    <>
      {matches.map((match) => (
        <GameListItem
          key={match.id}
          leftUser={match.user1}
          rightUser={match.user2}
          mode={match.mode}
          onClick={() => handleWatch(match.mode, match.id)}
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
            <GameListItemSkeleton />
            <GameListItemSkeleton />
            <GameListItemSkeleton />
          </Grid>
        </div>
      )}
    </>
  );
};

const AllMatchList = () => <MatchList type="ALL" />;
const LadderList = () => <MatchList type="LADDER" />;
const ExhibitionList = () => <MatchList type="EXHIBITION" />;

const list = [
  { name: 'ALL', link: ALL_MATCH_PATH },
  { name: 'LADDER', link: LADDER_MATCH_PATH },
  { name: 'EXHIBITION', link: EXHIBITION_MATCH_PATH },
];

const GameWatchPage = () => {
  const location = useLocation();
  return (
    <>
      <SubMenu current={location.pathname} list={list} />
      <List height="78vh" scroll>
        <Switch>
          <Route exact path={ALL_MATCH_PATH} component={AllMatchList} />
          <Route exact path={LADDER_MATCH_PATH} component={LadderList} />
          <Route exact path={EXHIBITION_MATCH_PATH} component={ExhibitionList} />
          <Route path="/">
            <Redirect to={ALL_MATCH_PATH} />
          </Route>
        </Switch>
      </List>
    </>
  );
};

export default GameWatchPage;
