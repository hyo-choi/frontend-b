import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const StyledTypo = withStyles({
  root: {
    'font-family': 'Pretendard',
  },
})(Typography);

type TypoProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2' | 'body1' | 'body2'
  | 'caption' | 'button',
  display?: 'initial' | 'block' | 'inline',
  gutterBottom?: boolean,
  children: React.ReactNode,
};

const Typo = ({
  variant, display, gutterBottom, children,
// eslint-disable-next-line arrow-body-style
}: TypoProps) => {
  return (
    <StyledTypo
      variant={variant}
      display={display}
      gutterBottom={gutterBottom}
    >
      {children}
    </StyledTypo>
  );
};

Typo.defaultProps = {
  variant: 'body1',
  display: 'initial',
  gutterBottom: false,
};

export default Typo;
