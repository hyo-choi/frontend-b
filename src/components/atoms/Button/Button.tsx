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
  variant?: 'contained' | 'outlined' | 'text',
  onClick?: MouseEventHandler<HTMLButtonElement>,
  type?: 'button' | 'submit' | 'reset',
  children: React.ReactNode,
  href?: string,
  disabled?: boolean,
};

const Button = ({
  variant, onClick, type, children, href, disabled,
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      type={type}
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
  variant: 'contained',
  onClick: null,
  type: 'button',
  href: undefined,
  disabled: false,
};

export default Button;
