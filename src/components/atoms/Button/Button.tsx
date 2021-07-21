/* eslint-disable arrow-body-style */
import React, { MouseEventHandler } from 'react';
import MaterialButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typo from '../Typo/Typo';

const StyledButton = withStyles({
  root: {
    margin: '0.25em',
  },
})(MaterialButton);

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode,
  href?: string,
  disabled?: boolean,
};

const Button = ({
  onClick, children, href, disabled,
}: ButtonProps) => {
  return (
    <StyledButton
      variant="contained"
      color="primary"
      onClick={onClick}
      href={href}
      disabled={disabled}
    >
      <Typo variant="button">{children}</Typo>
    </StyledButton>
  );
};

Button.defaultProps = {
  onClick: null,
  href: undefined,
  disabled: false,
};

export default Button;
