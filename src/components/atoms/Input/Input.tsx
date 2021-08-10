import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const StyledInput = withStyles({
  root: {
    width: '25ch',
    margin: '0.25em',
  },
})(TextField);

export type InputProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  value?: string,
  error?: boolean,
  type?: 'number' | 'text' | 'password',
  label?: string,
  helperText?: string,
  defaultValue?: string,
  disabled?: boolean,
};

const Input = ({
  onChange, value, error, type, label, helperText, defaultValue, disabled,
}: InputProps) => (
  defaultValue ? (
    <StyledInput
      onChange={onChange}
      defaultValue={defaultValue}
      type={type}
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
    />
  ) : (
    <StyledInput
      onChange={onChange}
      value={value}
      type={type}
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
    />
  )
);

Input.defaultProps = {
  type: 'text',
  value: '',
  label: '',
  helperText: '',
  defaultValue: '',
  error: false,
  disabled: false,
};

export default Input;
