import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import { RelatedInfoType } from '../../../types/User';
import { useAppDispatch, useUserState } from '../../../utils/hooks/useContext';
import { asyncGetRequest, makeAPIPath } from '../../../utils/utils';
import List from '../../atoms/List/List';
import Typo from '../../atoms/Typo/Typo';
import ProfileCard from '../../organisms/ProfileCard/ProfileCard';
import Dialog from '../../molecules/Dialog/Dialog';
import useDialog from '../../../utils/hooks/useDialog';
import { makeRelatedInfo } from '../../../utils/friendships';
import { initialRawFriendInfo, initialRawUserInfo, RawRelatedInfoType } from '../../../types/Response';

type MatchParams = {
  username: string,
};

const initialUserInfo: RelatedInfoType = {
  id: '',
  name: '',
  avatar: '',
  status: 'OFFLINE',
  relationship: 'NONE',
};

const ProfilePage = ({ match }: RouteComponentProps<MatchParams>) => {
  const [user, setUser] = useState<RelatedInfoType>(initialUserInfo);
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
    asyncGetRequest(makeAPIPath(`/users/${username}`))
      .then(({ data }) => {
        Object.assign(userInfo, data);
        return (
          asyncGetRequest(makeAPIPath(`/friendships/${username}`))
            .then((response) => {
              Object.assign(userInfo.friendship, response.data);
              setUser(makeRelatedInfo(me, userInfo));
            })
            .catch((error) => {
              if (error.response && [404, 409].includes(error.response.status)) {
                userInfo.friendship = null;
                setUser(makeRelatedInfo(me, userInfo));
              } else toast.error(error.message);
            })
        );
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          history.push('/404');
        } else {
          toast.error(error.message);
        }
      })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      });
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
      <Grid container direction="column" spacing={6} justifyContent="space-evenly" alignItems="stretch">
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
          <List height="15em" />
        </Grid>
        <Grid item>
          <Typo variant="h5">Achievements</Typo>
          <List height="15em" />
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;
