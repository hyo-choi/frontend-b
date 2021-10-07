import React from 'react';
import TextField from '@material-ui/core/TextField';

type ChatInputProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  value?: string,
};

const ChatInput = ({ onSubmit, onChange, value }: ChatInputProps) => (
  <form onSubmit={onSubmit}>
    <TextField
      onChange={onChange}
      value={value}
      label="Chat on here!"
      variant="outlined"
      fullWidth
    />
  </form>
);

ChatInput.defaultProps = {
  value: '',
};

export default React.memo(ChatInput);
