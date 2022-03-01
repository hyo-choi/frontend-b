import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, ButtonGroup } from '@material-ui/core';
import { Button } from '~components/index';

const useStyles = makeStyles({
  default: {
    width: '100%',
    backgroundColor: 'inherited',
  },
  active: {
    width: '100%',
    backgroundColor: '#dceeff',
  },
});

export type MenuListType = {
  name: string,
  link: string,
};

type SubMenuProps = {
  current: string,
  list: MenuListType[],
};

const SubMenu = ({ current, list }: SubMenuProps) => {
  const history = useHistory();
  const classes = useStyles();

  const handleClick = useCallback((link: string) => {
    history.push(link);
  }, []);

  return (
    <ButtonGroup
      variant="text"
      color="primary"
      aria-label="subMenu"
      fullWidth
    >
      {list.map(({ name, link }) => (
        <Button
          key={name}
          className={current === link ? classes.active : classes.default}
          variant="text"
          onClick={() => handleClick(link)}
        >
          {name}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default React.memo(SubMenu);
