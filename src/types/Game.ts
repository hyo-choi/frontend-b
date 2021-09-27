/* eslint-disable no-unused-vars */
import { UserInfoType } from './User';

export enum AchievementName {
  FIRST_GAME = 'FIRST_GAME',
  FIRST_WIN = 'FIRST_WIN',
  FIRST_LOSE = 'FIRST_LOSE',
  FIRST_FRIEND = 'FIRST_FRIEND',
  FIRST_BLOCK = 'FIRST_BLOCK',
}

export enum AchievementDescription {
  FIRST_GAME = 'You have successfully played your first game.',
  FIRST_WIN = 'Congratulations on your first win.',
  FIRST_LOSE = 'You have achieved your first lose.',
  FIRST_FRIEND = 'You made your first friend.',
  FIRST_BLOCK = 'You made your first hater.',
}

export type AchievementType = {
  name: AchievementName,
  description: AchievementDescription,
  createdAt: Date,
};
