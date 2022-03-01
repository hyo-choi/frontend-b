/* eslint-disable no-unused-vars */
import React from 'react';
import SportsEsportsTwoToneIcon from '@material-ui/icons/SportsEsportsTwoTone';
import GroupAddTwoToneIcon from '@material-ui/icons/GroupAddTwoTone';
import BlockTwoToneIcon from '@material-ui/icons/BlockTwoTone';
import ThumbUpTwoToneIcon from '@material-ui/icons/ThumbUpTwoTone';
import ThumbDownTwoToneIcon from '@material-ui/icons/ThumbDownTwoTone';
import { AchievementName } from '~types/Game';

const ACHIEVEMENT_LIST = {
  [AchievementName.FIRST_GAME]: <SportsEsportsTwoToneIcon fontSize="large" />,
  [AchievementName.FIRST_WIN]: <ThumbUpTwoToneIcon fontSize="large" />,
  [AchievementName.FIRST_LOSE]: <ThumbDownTwoToneIcon fontSize="large" />,
  [AchievementName.FIRST_FRIEND]: <GroupAddTwoToneIcon fontSize="large" />,
  [AchievementName.FIRST_BLOCK]: <BlockTwoToneIcon fontSize="large" />,
};

export default ACHIEVEMENT_LIST;
