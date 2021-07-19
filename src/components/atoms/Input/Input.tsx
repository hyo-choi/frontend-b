import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const StyledInput = withStyles({
  root: {
    width: '30ch',
    margin: '0.25em',
  },
})(TextField);

export type InputProps = {
  // eslint-disable-next-line no-unused-vars
  onChange: (event: React.ChangeEvent) => void,
  error?: boolean,
  type?: 'number' | 'text' | 'password',
  label?: string,
  helperText?: string,
  defaultValue?: string,
  disabled?: boolean,
};

const Input = ({
  onChange, error, type, label, helperText, defaultValue, disabled,
// eslint-disable-next-line arrow-body-style
}: InputProps) => {
  return (
    <StyledInput
      onChange={onChange}
      type={type}
      label={label}
      helperText={helperText}
      defaultValue={defaultValue}
      error={error}
      disabled={disabled}
    />
  );
};

Input.defaultProps = {
  type: 'text',
  label: '',
  helperText: '',
  defaultValue: '',
  error: false,
  disabled: false,
};

export default Input;
