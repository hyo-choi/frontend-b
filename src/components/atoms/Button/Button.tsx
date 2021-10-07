import React from 'react';
import MaterialButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typo from '../Typo/Typo';

const StyledButton = withStyles({
  root: {
    margin: '0.25em',
  },
})(MaterialButton);

type ButtonProps = {
  className?: string,
  variant?: 'contained' | 'outlined' | 'text',
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  type?: 'button' | 'submit' | 'reset',
  children: React.ReactNode,
  href?: string,
  disabled?: boolean,
  color?: 'primary' | 'secondary',
};

const Button = ({
  className, variant, onClick, type, children, href, disabled, color,
}: ButtonProps) => (
  <StyledButton
    className={className}
    variant={variant}
    type={type}
    onClick={onClick}
    href={href}
    disabled={disabled}
    color={color}
  >
    <Typo variant="button">{children}</Typo>
  </StyledButton>
);

Button.defaultProps = {
  className: null,
  variant: 'contained',
  onClick: null,
  type: 'button',
  href: undefined,
  disabled: false,
  color: 'primary',
};

export default React.memo(Button);
