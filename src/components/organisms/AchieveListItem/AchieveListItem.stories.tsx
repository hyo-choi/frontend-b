import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import AchieveListItem, { AchieveListItemSkeleton } from './AchieveListItem';
import List from '../../atoms/List/List';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import ContextProvider from '../../../utils/hooks/useContext';
import { AchievementDescription, AchievementName, AchievementType } from '../../../types/Game';

export default {
  title: 'organisms/AchieveListItem',
  component: AchieveListItem,
} as Meta;

const dummyAchieveList: AchievementType[] = [
  {
    name: AchievementName.FIRST_GAME,
    description: AchievementDescription.FIRST_GAME,
    createdAt: new Date(),
  },
  {
    name: AchievementName.FIRST_WIN,
    description: AchievementDescription.FIRST_WIN,
    createdAt: new Date(),
  },
  {
    name: AchievementName.FIRST_LOSE,
    description: AchievementDescription.FIRST_LOSE,
    createdAt: new Date(),
  },
  {
    name: AchievementName.FIRST_FRIEND,
    description: AchievementDescription.FIRST_FRIEND,
    createdAt: new Date(),
  },
  {
    name: AchievementName.FIRST_BLOCK,
    description: AchievementDescription.FIRST_BLOCK,
    createdAt: new Date(),
  },
];

export const Default = () => (
  <AchieveListItem info={dummyAchieveList[0]} />
);

export const Skeleton = () => (
  <AchieveListItemSkeleton />
);

export const WithList = () => (
  <List scroll height="15em">
    {dummyAchieveList.map((achievement) => <AchieveListItem info={achievement} />)}
  </List>
);

export const WithTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={<WithList />}
        chat={<h1>Chat</h1>}
      />
    </ContextProvider>
  </BrowserRouter>
);
