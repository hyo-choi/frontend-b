/* eslint-disable arrow-body-style */
import React from 'react';
import { Meta } from '@storybook/react';
import Button from './Button';

export default {
  component: Button,
  title: 'atoms/Button',
} as Meta;

export const Default = () => {
  return (
    <>
      <>
        <Button onClick={() => {}}>LONG LONG LONG CONTENT</Button>
        <Button onClick={() => {}}>SHORT CONTENT</Button>
        <Button onClick={() => {}}>SHORT</Button>
      </>
      <br />
      <>
        <Button onClick={() => {}} disabled>LONG LONG LONG CONTENT</Button>
        <Button onClick={() => {}} disabled>SHORT CONTENT</Button>
        <Button onClick={() => {}} disabled>SHORT</Button>
      </>
    </>
  );
};
