import React from 'react';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

const StyledDigitInput = withStyles({
  root: {
    width: 70,
    height: 100,
    border: '1px solid gray',
    borderRadius: '5px',
  },
})(Input);

type DigitInputProps = {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  value?: string,
};

const DigitInput = ({ onChange, value }: DigitInputProps) => (
  <StyledDigitInput
    type="text"
    inputProps={{ style: { textAlign: 'center', fontSize: 40 }, maxLength: 1 }}
    onChange={onChange}
    value={value}
    disableUnderline
  />
);

DigitInput.defaultProps = {
  value: '',
};

export default DigitInput;
