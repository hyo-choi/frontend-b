/* eslint-disable arrow-body-style */
import React from 'react';
import MaterialSwitch from '@material-ui/core/Switch';

type SwitchProps = {
  checked?: boolean,
  // eslint-disable-next-line no-unused-vars
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  name?: string,
};

const Switch = ({
  checked, onChange, name,
}: SwitchProps) => {
  return (
    <MaterialSwitch
      checked={checked}
      onChange={onChange}
      name={name}
      color="primary"
    />
  );
};

Switch.defaultProps = {
  checked: false,
  name: '',
};

export default Switch;
