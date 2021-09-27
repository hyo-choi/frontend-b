import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { Redirect, Route, Switch } from 'react-router-dom';
import { asyncGetRequest, errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import { RawMatchType, MatchType } from '../../../types/Match';
import List from '../../atoms/List/List';
import SubMenu from '../../molecules/SubMenu/SubMenu';
import useIntersect from '../../../utils/hooks/useIntersect';
import GameListItem, { GameListItemSkeleton } from '../../organisms/GameListItem/GameListItem';

const ALL_MATCH_PATH = '/game/watch/all';
const LADDER_MATCH_PATH = '/game/watch/ladder';
const EXHIBITION_MATCH_PATH = '/game/watch/exhibition';

const COUNTS_PER_PAGE = 10;

type ListProps = {
  type: 'ALL' | 'LADDER' | 'EXHIBITION',
}

const MatchList = ({ type }: ListProps) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const path = makeAPIPath('/matches/spectating');
  const typePath = type === 'ALL' ? '' : `&type=${type}`;
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(0);

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}${typePath}`, source)
      .then(({ data }: { data: RawMatchType[] }) => {
        const typed: MatchType[] = data.map((match) => ({
          ...match,
          createdAt: new Date(match.createdAt),
          user1: { ...match.user1, avatar: makeAPIPath(`/${match.user1.avatar}`) },
          user2: { ...match.user2, avatar: makeAPIPath(`/${match.user2.avatar}`) },
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
    await new Promise((resolve) => setTimeout(resolve, 250));
    setPage((prev) => prev + 1);
    observer.observe(entry.target);
  });

  useEffect(() => {
    setListEnd(false);

    return () => {
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
          onClick={() => {}}
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

const GameWatchPage = () => (
  <>
    <SubMenu current={window.location.pathname} list={list} />
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

export default GameWatchPage;
