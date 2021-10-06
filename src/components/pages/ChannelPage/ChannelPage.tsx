import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Redirect, Route, Switch, useLocation,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { asyncGetRequest, errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import List from '../../atoms/List/List';
import SubMenu from '../../molecules/SubMenu/SubMenu';
import Button from '../../atoms/Button/Button';
import Dialog from '../../molecules/Dialog/Dialog';
import ChannelListItem, { ChannelListItemSkeleton } from '../../organisms/ChannelListItem/ChannelListItem';
import useDialog from '../../../utils/hooks/useDialog';
import useIntersect from '../../../utils/hooks/useIntersect';
import { ChannelType, RawChannelType } from '../../../types/Chat';
import { makeChannelInfo, renewUnreads } from '../../../utils/channels';
import ChannelInfoForm from '../../organisms/ChannelInfoForm/ChannelInfoForm';
import { useAppState } from '../../../utils/hooks/useAppContext';

const ALL_PATH = '/channel/all';
const JOINED_PATH = '/channel/joined';

const COUNTS_PER_PAGE = 10;

const useStyles = makeStyles({
  button: {
    width: '100%',
  },
});

type ListProps = {
  type: 'joined' | 'all',
};

const list = [
  { name: '참여 채널', link: JOINED_PATH },
  { name: '전체 채널', link: ALL_PATH },
];

const ChannelList = ({ type }: ListProps) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const path = type === 'joined' ? makeAPIPath('/channels/me') : makeAPIPath('/channels');
  const appState = useAppState();
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isListEnd, setListEnd] = useState(false);
  const [page, setPage] = useState<number>(1);
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}`, source)
      .then(({ data }) => {
        const typed: ChannelType[] = data.map((channel: RawChannelType) => (
          makeChannelInfo(channel)));
        setChannels((prev) => prev.concat(typed));
        if (page === 1) {
          setChannels((prev) => renewUnreads(prev, appState.channels) as ChannelType[]);
        }
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

  useEffect(() => () => {
    source.cancel();
    setChannels([]);
    setListEnd(true);
  }, []);

  useEffect(() => {
    setChannels((prev) => renewUnreads(prev, appState.channels) as ChannelType[]);
  }, [appState.channels]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      {channels.map((channel: any) => (
        <ChannelListItem
          key={channel.name}
          info={channel}
          setOpen={setOpen}
          setDialog={setDialog}
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
          <ChannelListItemSkeleton />
          <ChannelListItemSkeleton />
          <ChannelListItemSkeleton />
        </Grid>
      </div>
      )}
    </>
  );
};

const JoinedList = () => <ChannelList type="joined" />;
const AllList = () => <ChannelList type="all" />;

const ChannelPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isOpen, setOpen } = useDialog();

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Channel Register"
        content={<ChannelInfoForm setOpen={setOpen} />}
        onClose={() => setOpen(false)}
      />
      <Grid container>
        <Grid item container justifyContent="center" xs={10}>
          <SubMenu current={location.pathname} list={list} />
        </Grid>
        <Grid item container justifyContent="flex-end" xs={2}>
          <Button className={classes.button} variant="outlined" onClick={() => setOpen(true)}>채널 개설</Button>
        </Grid>
      </Grid>
      <List height="78vh" scroll>
        <Switch>
          <Route exact path={JOINED_PATH} component={JoinedList} />
          <Route exact path={ALL_PATH} component={AllList} />
          <Route path="/">
            <Redirect to={JOINED_PATH} />
          </Route>
        </Switch>
      </List>
    </>
  );
};

export default ChannelPage;
