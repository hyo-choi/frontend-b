import React from 'react';
import { Meta } from '@storybook/react';
import Button from './Button';

export default {
  component: Button,
  title: 'atoms/Button',
} as Meta;

export const Default = () => (
  <>
    <>
      <Button>LONG LONG LONG CONTENT</Button>
      <Button>SHORT CONTENT</Button>
      <Button>SHORT</Button>
    </>
    <br />
    <>
      <Button disabled>LONG LONG LONG CONTENT</Button>
      <Button disabled>SHORT CONTENT</Button>
      <Button disabled>SHORT</Button>
    </>
  </>
);

export const hrefButton = () => (
  <Button href="#">href Button</Button>
);
