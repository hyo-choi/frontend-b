import React from 'react';
import { Meta } from '@storybook/react';
import Typo from './Typo';

export default {
  component: Typo,
  title: 'atoms/Typo',
} as Meta;

export const Default = () => (
  <>
    <Typo variant="h1" gutterBottom>
      h1. Heading
    </Typo>
    <Typo variant="h2" gutterBottom>
      h2. Heading
    </Typo>
    <Typo variant="h3" gutterBottom>
      h3. Heading
    </Typo>
    <Typo variant="h4" gutterBottom>
      h4. Heading
    </Typo>
    <Typo variant="h5" gutterBottom>
      h5. Heading
    </Typo>
    <Typo variant="h6" gutterBottom>
      h6. Heading
    </Typo>
    <Typo variant="subtitle1" gutterBottom>
      subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
    </Typo>
    <Typo variant="subtitle2" gutterBottom>
      subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
    </Typo>
    <Typo variant="body1" gutterBottom>
      body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
      dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
    </Typo>
    <Typo variant="body2" gutterBottom>
      body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
      dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
    </Typo>
    <Typo variant="button" display="block" gutterBottom>
      Button text
    </Typo>
    <Typo variant="caption" display="block" gutterBottom>
      caption text
    </Typo>
  </>
);

export const Korean = () => (
  <>
    <Typo variant="h1" gutterBottom>
      h1. 헤딩
    </Typo>
    <Typo variant="h2" gutterBottom>
      h2. 헤딩
    </Typo>
    <Typo variant="h3" gutterBottom>
      h3. 헤딩
    </Typo>
    <Typo variant="h4" gutterBottom>
      h4. 헤딩
    </Typo>
    <Typo variant="h5" gutterBottom>
      h5. 헤딩
    </Typo>
    <Typo variant="h6" gutterBottom>
      h6. 헤딩
    </Typo>
    <Typo variant="subtitle1" gutterBottom>
      subtitle1. 다람쥐 헌 쳇바퀴에 타고파
    </Typo>
    <Typo variant="subtitle2" gutterBottom>
      subtitle2. 다람쥐 헌 쳇바퀴에 타고파
    </Typo>
    <Typo variant="body1" gutterBottom>
      body1. 산토끼 토끼야 어디를 가느냐 깡충깡충 뛰면서 어디를 가느냐
      산고개 고개를 나혼자 넘어서 토실토실 알밤을 주워 올 테야
      산토끼 토끼야 어디를 가느냐 깡충깡충 뛰면서 어디를 가느냐
    </Typo>
    <Typo variant="body2" gutterBottom>
      body2. 산토끼 토끼야 어디를 가느냐 깡충깡충 뛰면서 어디를 가느냐
      산고개 고개를 나혼자 넘어서 토실토실 알밤을 주워 올 테야
      산토끼 토끼야 어디를 가느냐 깡충깡충 뛰면서 어디를 가느냐
    </Typo>
    <Typo variant="button" display="block" gutterBottom>
      버튼 텍스트
    </Typo>
    <Typo variant="caption" display="block" gutterBottom>
      캡션 텍스트
    </Typo>
  </>
);
