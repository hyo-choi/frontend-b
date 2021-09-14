import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useUserState } from '../../../utils/hooks/useUserContext';
import { useAppDispatch, useAppState } from '../../../utils/hooks/useAppContext';
import { FriendshipType, RelatedInfoType } from '../../../types/User';
import Button from '../../atoms/Button/Button';
import UserProfile from '../../molecules/UserProfile/UserProfile';
import { SetDialogType, SetOpenType } from '../../../utils/hooks/useDialog';
import UserInfoForm from '../UserInfoForm/UserInfoForm';
import { errorMessageHandler, makeAPIPath } from '../../../utils/utils';
import { makeRelationship } from '../../../utils/friendships';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    width: '100%',
    height: '100px',
  },
  button: {
    width: '6.5em',
  },
  '@keyframes loading': {
    '0%': {
      backgroundColor: 'rgba(165, 165, 165, 0.1)',
    },
    '50%': {
      backgroundColor: 'rgba(165, 165, 165, 0.3)',
    },
    '100%': {
      backgroundColor: 'rgba(165, 165, 165, 0.1)',
    },
  },
  skeleton: {
    animation: '$loading 1.8s infinite ease-in-out',
  },
  skeletonCard: {
    padding: '0.5em',
    width: '100%',
    height: '100px',
  },
  skeletonAvatar: {
    width: '72px',
    height: '72px',
    borderRadius: '36px',
  },
  skeletonTypo: {
    margin: '5px',
    width: '90%',
    height: '20px',
  },
  skeletonButton: {
    margin: '0.25em',
    padding: '5px 15px',
    borderRadius: '4px',
    width: '61px',
    height: '26px',
  },
});

export const ProfileCardSkeleton = () => {
  const classes = useStyles();
  return (
    <Grid className={classes.skeletonCard} item container justifyContent="space-around" alignItems="center">
      <Grid item container justifyContent="space-around" alignItems="center" xs={5}>
        <Grid container item xs={6} justifyContent="center">
          <div className={`${classes.skeletonAvatar} ${classes.skeleton}`}>{}</div>
        </Grid>
        <Grid item xs={6}>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
          <div className={`${classes.skeletonTypo} ${classes.skeleton}`}> </div>
        </Grid>
      </Grid>
      <Grid item container justifyContent="flex-end" alignItems="center" xs={7}>
        <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
        <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
        <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
        <div className={`${classes.skeletonButton} ${classes.skeleton}`}> </div>
      </Grid>
    </Grid>
  );
};

type ProfileCardProps = {
  userInfo: RelatedInfoType,
  // eslint-disable-next-line no-unused-vars
  setUser: (value: RelatedInfoType) => void,
  setOpen: SetOpenType,
  setDialog: SetDialogType,
  profile?: boolean,
};

type ButtonObjType = {
  text: string,
  onClick: React.MouseEventHandler,
};

const ProfileCard = ({
  userInfo, setUser, setOpen, setDialog, profile,
}: ProfileCardProps) => {
  const {
    id, name, relationship,
  } = userInfo;
  const me = useUserState();
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const history = useHistory();
  const classes = useStyles();

  const myButton: ButtonObjType = {
    text: '정보 수정',
    onClick: () => {
      const content = (
        <UserInfoForm
          currentName={me.name}
          currentAvatarSrc={me.avatar}
          current2FA={me.enable2FA!}
          setOpen={setOpen}
          setDialog={setDialog}
        />
      );
      setDialog({
        title: 'Edit Profile',
        content,
        onClose: () => { setOpen(false); },
      });
      setOpen(true);
    },
  };

  const handlePostRequest = (
    comment: string,
    status?: FriendshipType,
  ) => {
    appDispatch({ type: 'loading' });
    axios.post(makeAPIPath(status ? '/blocks' : '/friendships'), {
      addresseeName: name,
    })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        setUser({
          ...userInfo,
          relationship: makeRelationship(true, status || 'REQUESTED'),
        });
        toast(comment);
      })
      .catch((error) => { errorMessageHandler(error); });
    setOpen(false);
  };

  const handlePatchRequest = (
    comment: string,
    status: FriendshipType,
  ) => {
    appDispatch({ type: 'loading' });
    axios.patch(makeAPIPath(`/friendships/${name}/status`), {
      status,
    })
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(({ data }) => {
        setUser({
          ...userInfo,
          status: data ? data.addressee.status : userInfo.status,
          relationship: makeRelationship(true, status),
        });
        toast(comment);
      })
      .catch((error) => { errorMessageHandler(error); });
    setOpen(false);
  };

  const handleDeleteRequest = (
    comment: string,
    path: string,
  ) => {
    appDispatch({ type: 'loading' });
    axios.delete(makeAPIPath(`${path}/${name}`))
      .finally(() => {
        appDispatch({ type: 'endLoading' });
      })
      .then(() => {
        setUser({
          ...userInfo,
          relationship: 'NONE',
        });
        toast(comment);
      })
      .catch((error) => { errorMessageHandler(error); });
    setOpen(false);
  };

  const friendButton: ButtonObjType | null = (() => {
    switch (relationship) {
      case 'NONE':
      case 'BLOCKED':
        return {
          text: '친구 요청',
          onClick: () => {
            setDialog({
              title: '친구 요청 확인',
              content: `${name}님에게 친구 요청을 보내시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={
                      () => handlePostRequest('친구 요청을 보냈습니다.')
                    }
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => { setOpen(false); },
            });
            setOpen(true);
          },
        };
      case 'FRIEND':
        return {
          text: '친구 삭제',
          onClick: () => {
            setDialog({
              title: '친구 삭제 확인',
              content: `${name}님을 친구에서 삭제하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={
                      () => handleDeleteRequest('친구를 삭제했습니다.', '/friends')
                    }
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => { setOpen(false); },
            });
            setOpen(true);
          },
        };
      case 'REQUESTING':
        return {
          text: '친구 요청 취소',
          onClick: () => {
            setDialog({
              title: '친구 요청 취소',
              content: `${name}님에게 보낸 친구 추가 요청을 취소하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={
                      () => handleDeleteRequest('친구 요청을 취소했습니다.', '/friendships')
                    }
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => { setOpen(false); },
            });
            setOpen(true);
          },
        };
      case 'REQUESTED':
        return {
          text: '친구 요청 수락',
          onClick: () => {
            setDialog({
              title: '친구 요청 수락',
              content: `${name}님의 친구 요청을 수락하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    color="secondary"
                    onClick={
                      () => handlePatchRequest('친구 요청을 거절했습니다.', 'DECLINED')
                    }
                  >
                    decline
                  </Button>
                  <Button
                    type="button"
                    onClick={
                      () => handlePatchRequest('친구 요청을 수락했습니다.', 'ACCEPTED')
                    }
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => { setOpen(false); },
            });
            setOpen(true);
          },
        };
      case 'BLOCKING':
      default:
        return null;
    }
  })();

  const blockButton: ButtonObjType = (() => {
    switch (relationship) {
      case 'BLOCKING':
        return {
          text: '차단 취소',
          onClick: () => {
            setDialog({
              title: '차단 취소',
              content: `${name}님을 차단 해제 하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={
                      () => {
                        handleDeleteRequest('차단 해제했습니다.', '/blocks');
                        appDispatch({ type: 'renewBlockList', list: appState.blockList.filter((user) => user !== name) });
                      }
                    }
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => { setOpen(false); },
            });
            setOpen(true);
          },
        };
      default:
        return {
          text: '유저 차단',
          onClick: () => {
            setDialog({
              title: '유저 차단',
              content: `${name}님을 차단하시겠습니까?`,
              buttons: (
                <>
                  <Button variant="text" onClick={() => { setOpen(false); }}>cancel</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handlePostRequest('해당 유저를 차단했습니다.', 'BLOCKED');
                      appDispatch({ type: 'renewBlockList', list: appState.blockList.concat(name) });
                    }}
                  >
                    confirm
                  </Button>
                </>),
              onClose: () => { setOpen(false); },
            });
            setOpen(true);
          },
        };
    }
  })();

  const otherButtons: ButtonObjType[] = (() => {
    const array = [
      {
        text: 'DM',
        onClick: () => {
          appDispatch({ type: 'enterChat', chatting: { type: 'DM', name } });
        },
      },
      {
        text: '매치 초대',
        onClick: () => {
          // TODO: API 구현 후, 추가
        },
      },
    ];
    if (profile) return array;
    return array.concat({
      text: '프로필',
      onClick: () => { history.push(`/profile/${name}`); },
    });
  })();

  const buttonArray = () => {
    const array: ButtonObjType[] = [];

    if (me.id === id) {
      array.push(myButton);
      return array;
    }
    if (friendButton) array.push(friendButton);
    if (profile || relationship === 'BLOCKING') array.push(blockButton);
    return (!profile && relationship === 'NONE') ? otherButtons : array.concat(otherButtons);
  };

  const Buttons = buttonArray().map((button) => (
    <Grid item key={button.text}>
      <Button
        className={['친구 요청 취소', '친구 요청 수락'].includes(button.text) ? '' : classes.button}
        variant={['친구 요청 취소', '친구 요청 수락'].includes(button.text) ? 'contained' : 'outlined'}
        onClick={button.onClick}
        key={button.text}
      >
        {button.text}
      </Button>
    </Grid>
  ));

  return (
    <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
      <UserProfile userInfo={userInfo} profile={profile} />
      <Grid item container justifyContent="flex-end" alignItems="center" xs={7}>
        {Buttons}
      </Grid>
    </Grid>
  );
};

ProfileCard.defaultProps = {
  profile: false,
};

export default ProfileCard;
