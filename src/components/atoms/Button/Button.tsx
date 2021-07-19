/* eslint-disable arrow-body-style */
import React from 'react';
import MaterialButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
  root: {
    margin: '0.25em',
  },
})(MaterialButton);

type ButtonProps = {
  // eslint-disable-next-line no-unused-vars
  onClick: (event: React.MouseEvent) => void,
  children: React.ReactNode,
  disabled?: boolean,
};

const Button = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <StyledButton
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

Button.defaultProps = {
  disabled: false,
};

export default Button;
