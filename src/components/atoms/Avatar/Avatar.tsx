import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MaterialAvatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(1),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

type AvatarProps = {
  src?: string,
  alt: string,
  size?: 'small' | 'medium' | 'large',
};

const Avatar = ({
  src, alt, size,
} : AvatarProps) => {
  const classes = useStyles();
  return (
    <MaterialAvatar
      className={`${classes.root} ${classes[size!]}`}
      src={src}
      alt={alt}
    />
  );
};

Avatar.defaultProps = {
  src: '',
  size: 'medium',
};

export default Avatar;
