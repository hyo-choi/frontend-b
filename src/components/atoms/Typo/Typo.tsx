import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const StyledTypo = withStyles({
  root: {
    'font-family': 'Pretendard',
  },
})(Typography);

type TypoProps = {
  className?: string,
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2' | 'body1' | 'body2'
  | 'caption' | 'button',
  display?: 'initial' | 'block' | 'inline',
  align?: 'inherit' | 'center' | 'left' | 'right',
  gutterBottom?: boolean,
  children: React.ReactNode,
};

const Typo = ({
  className, variant, display, align, gutterBottom, children,
// eslint-disable-next-line arrow-body-style
}: TypoProps) => {
  return (
    <StyledTypo
      className={className}
      variant={variant}
      align={align}
      display={display}
      gutterBottom={gutterBottom}
    >
      {children}
    </StyledTypo>
  );
};

Typo.defaultProps = {
  className: '',
  variant: 'body1',
  display: 'initial',
  align: 'inherit',
  gutterBottom: false,
};

export default Typo;
