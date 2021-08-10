import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useUserState } from '../../../utils/hooks/useContext';
import { UserInfoType } from '../../../types/User';
import Button from '../../atoms/Button/Button';
import UserProfile from '../../molecules/UserProfile/UserProfile';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    width: '100%',
    height: '100px',
  },
  button: {
    width: '6.5em',
  },
});

type ProfileCardProps = {
  userInfo: UserInfoType,
  onProfileEdit: React.MouseEventHandler,
  onFriendAdd: React.MouseEventHandler,
  onUserBlock: React.MouseEventHandler,
  onDMClick: React.MouseEventHandler,
  onMatchInvite: React.MouseEventHandler,
};

type ButtonObjType = {
  text: string,
  onClick: React.MouseEventHandler,
};

const ProfileCard = ({
  userInfo, onProfileEdit, onFriendAdd, onUserBlock, onDMClick, onMatchInvite,
}: ProfileCardProps) => {
  const me = useUserState();
  const classes = useStyles({ status: userInfo.status });

  const myButtons: ButtonObjType[] = [
    {
      text: '정보 수정',
      onClick: onProfileEdit,
    },
  ];

  const otherButtons: ButtonObjType[] = [
    {
      text: '친구 추가',
      onClick: onFriendAdd,
    },
    {
      text: '유저 차단',
      onClick: onUserBlock,
    },
    {
      text: 'DM',
      onClick: onDMClick,
    },
    {
      text: '매치 초대',
      onClick: onMatchInvite,
    },
  ];

  const buttonArray = me.id === userInfo.id ? myButtons : otherButtons;

  const Buttons = buttonArray.map((button) => (
    <Grid item key={button.text}>
      <Button
        className={classes.button}
        variant="outlined"
        onClick={button.onClick}
        key={button.text}
      >
        {button.text}
      </Button>
    </Grid>
  ));

  return (
    <Grid className={classes.root} item container justifyContent="space-around" alignItems="center">
      <UserProfile userInfo={userInfo} />
      <Grid item container justifyContent="flex-end" alignItems="center" xs={7}>
        {Buttons}
      </Grid>
    </Grid>
  );
};

export default ProfileCard;
