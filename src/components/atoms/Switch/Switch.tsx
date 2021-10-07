import React from 'react';
import MaterialSwitch from '@material-ui/core/Switch';

type SwitchProps = {
  checked?: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  name?: string,
};

const Switch = ({
  checked, onChange, name,
}: SwitchProps) => (
  <MaterialSwitch
    checked={checked}
    onChange={onChange}
    name={name}
    color="primary"
  />
);

Switch.defaultProps = {
  checked: false,
  name: '',
};

export default React.memo(Switch);
