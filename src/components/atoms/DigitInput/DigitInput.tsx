import React, { ForwardedRef } from 'react';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

const StyledDigitInput = withStyles({
  root: {
    width: 70,
    height: 100,
    margin: '5px',
    border: '1px solid gray',
    borderRadius: '5px',
  },
})(Input);

type DigitInputProps = {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  name?: string,
  value?: string,
};

const DigitInput = React.forwardRef(({ onChange, name, value }: DigitInputProps,
  ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>) => (
    <StyledDigitInput
      type="text"
      name={name}
      inputRef={ref}
      inputProps={{ style: { textAlign: 'center', fontSize: 40 }, maxLength: 1 }}
      onChange={onChange}
      value={value}
      disableUnderline
    />
));

DigitInput.defaultProps = {
  value: '',
  name: '',
};

export default DigitInput;
