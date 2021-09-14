import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { asyncGetRequest, errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import List from '../../atoms/List/List';
import useIntersect from '../../../utils/hooks/useIntersect';
import { DMRoomType } from '../../../types/Chat';
import { DMToMessage } from '../../../utils/chats';
import { useUserState } from '../../../utils/hooks/useUserContext';
import { RawUserInfoType } from '../../../types/Response';
import DMListItem, { DMListItemSkeleton } from '../../organisms/DMListItem/DMListItem';
import { UserInfoType } from '../../../types/User';
import { useAppState } from '../../../utils/hooks/useAppContext';

const COUNTS_PER_PAGE = 10;

const DMPage = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const [DMs, setDMs] = useState<DMRoomType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(0);
  const userState = useUserState();
  const appState = useAppState();
  const path = makeAPIPath('/dmers');

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}`, source)
      .then(({ data }: { data: RawUserInfoType[] }) => {
        const promises = data.map((one) => axios.get(makeAPIPath(`/dms/opposite/${one.name}?perPage=1&page=1`), {
          cancelToken: source.token,
        }));
        Promise.all(promises)
          .then((responses) => {
            const fetchedRooms: DMRoomType[] = responses.map((response): DMRoomType => {
              const latestMessage = DMToMessage(response.data[0], userState.name);
              const opposite: UserInfoType = data.find((one) => one.name === latestMessage.name)!;
              const DM = appState.DMs.find((one) => one.name === opposite.name);
              return {
                ...opposite,
                avatar: makeAPIPath(`/${opposite.avatar}`),
                latestMessage,
                unreads: DM ? DM.unreads : 0,
              };
            });
            setDMs((prev) => prev.concat(fetchedRooms));
            if (data.length === 0 || data.length < COUNTS_PER_PAGE) setListEnd(true);
          })
          .catch((error) => {
            source.cancel();
            errorMessageHandler(error);
            setListEnd(true);
          });
      })
      .catch((error) => {
        source.cancel();
        errorMessageHandler(error);
        setListEnd(true);
      });
  };

  useEffect(() => {
    if (DMs.length === 0 && appState.DMs.length !== 0) {
      setListEnd(false);
      setPage(1);
    } else if (DMs.length !== 0 && appState.DMs.length !== 0) {
      setDMs((prev) => prev.map((DM) => {
        const found = appState?.DMs?.find((one) => one.name === DM.name);
        if (!found || found.latestMessage.user.id === '') return DM;
        return { ...DM, latestMessage: found.latestMessage, unreads: found.unreads };
      }));
    }
  }, [appState.DMs]);

  useEffect(() => {
    if (page !== 0) fetchItems();
  }, [page]);

  // eslint-disable-next-line no-unused-vars
  const [_, setRef] = useIntersect(async (entry: any, observer: any) => {
    observer.unobserve(entry.target);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setPage((prev) => prev + 1);
    observer.observe(entry.target);
  });

  useEffect(() => {
    if (appState.DMs.length !== 0) {
      setPage(1);
      setListEnd(false);
    }
    return () => {
      source.cancel();
      setDMs([]);
      setListEnd(true);
    };
  }, []);

  return (
    <>
      <List height="84vh" scroll>
        {DMs.map((room: DMRoomType) => (
          <DMListItem roomInfo={room} key={room.id} />
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
            <DMListItemSkeleton />
            <DMListItemSkeleton />
            <DMListItemSkeleton />
          </Grid>
        </div>
        )}
      </List>
    </>
  );
};

export default DMPage;
