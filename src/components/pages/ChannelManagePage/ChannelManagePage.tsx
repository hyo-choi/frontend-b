import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import { asyncGetRequest } from '../../../utils/utils';
import List from '../../atoms/List/List';
import Button from '../../atoms/Button/Button';
import Dialog from '../../molecules/Dialog/Dialog';
import useDialog from '../../../utils/hooks/useDialog';
import useIntersect from '../../../utils/hooks/useIntersect';
import { MembershipRole, MemberType } from '../../../types/Chat';
import Typo from '../../atoms/Typo/Typo';
import { useAppDispatch } from '../../../utils/hooks/useAppContext';
import { useUserState } from '../../../utils/hooks/useUserContext';
import ChannelInfoForm from '../../organisms/ChannelInfoForm/ChannelInfoForm';
import ChannelUserListItem, { ChannelUserListItemSkeleton } from '../../organisms/ChannelUserListItem/ChannelUserListItem';
import useError from '../../../utils/hooks/useError';

const COUNTS_PER_PAGE = 10;

type MatchParams = {
  channelName: string,
};

const ChannelManagePage = ({ match }: RouteComponentProps<MatchParams>) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const [role, setRole] = useState<MembershipRole>('NONE');
  const [users, setUsers] = useState<MemberType[]>([]);
  const [isListEnd, setListEnd] = useState(true);
  const [page, setPage] = useState<number>(0);
  const { channelName } = match.params;
  const path = `/channels/${channelName}/members`;
  const {
    isOpen, setOpen, dialog, setDialog,
  } = useDialog();
  const errorMessageHandler = useError();
  const history = useHistory();
  const userState = useUserState();
  const appDispatch = useAppDispatch();

  const handleChangePassword = () => {
    setDialog({
      title: 'Channel Edit',
      content: <ChannelInfoForm setOpen={setOpen} channel={channelName} />,
      onClose: () => { setOpen(false); },
    });
    setOpen(true);
  };

  const fetchItems = () => {
    if (isListEnd) return;

    asyncGetRequest(`${path}?perPage=${COUNTS_PER_PAGE}&page=${page}`)
      .then(({ data }) => {
        setUsers((prev) => prev.concat(data));
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
    appDispatch({ type: 'loading' });
    asyncGetRequest(`/channels/${channelName}/members`)
      .finally(() => { appDispatch({ type: 'endLoading' }); })
      .then(({ data }) => {
        const found = data.find((member: MemberType) => (
          member.name === userState.name && ['ADMIN', 'OWNER'].includes(member.memberships[0].role)));
        if (found) {
          setRole(found.memberships[0].role);
          setListEnd(false);
        } else {
          toast.error('접근 권한이 없습니다.');
          history.goBack();
        }
      })
      .catch((error) => {
        source.cancel();
        errorMessageHandler(error);
        history.goBack();
      });

    return () => {
      source.cancel();
      setUsers([]);
      setListEnd(true);
    };
  }, []);

  return (['ADMIN', 'OWNER'].includes(role) ? (
    <>
      <Dialog
        isOpen={isOpen}
        title={dialog.title}
        content={dialog.content}
        buttons={dialog.buttons}
        onClose={dialog.onClose}
      />
      <Grid container justifyContent="space-between" alignItems="center">
        <Typo variant="h6">{`🛠 채널 관리: ${channelName}`}</Typo>
        <Button variant="outlined" onClick={handleChangePassword}>채널 정보 변경</Button>
      </Grid>
      <List height="78vh" scroll>
        {users.map((user: MemberType) => (
          <ChannelUserListItem
            key={user.id}
            info={user}
            myRole={role as ('ADMIN' | 'OWNER')}
            setUser={(userInfo) => {
              if (userInfo.memberships[0].role === 'NONE') {
                setUsers(users.filter((one) => one.id !== userInfo.id));
              } else setUsers(users.filter((one) => one.id !== userInfo.id).concat(userInfo));
            }}
            setOpen={setOpen}
            setDialog={setDialog}
            channelName={channelName}
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
            <ChannelUserListItemSkeleton />
            <ChannelUserListItemSkeleton />
            <ChannelUserListItemSkeleton />
          </Grid>
        </div>
        )}
      </List>
    </>
  ) : <></>);
};

export default ChannelManagePage;
