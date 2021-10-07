import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MaterialAvatar from '@material-ui/core/Avatar';

type StyleProps = { isClickable: boolean };

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(1),
    cursor: ({ isClickable }: StyleProps) => (isClickable ? 'pointer' : 'inherit'),
    '&:hover': {
      opacity: ({ isClickable }: StyleProps) => (isClickable ? '0.5' : '1.0'),
      transition: 'all 0.2s',
    },
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
  className?: string,
  src?: string,
  alt: string,
  size?: 'small' | 'medium' | 'large',
  onClick?: React.MouseEventHandler,
};

const Avatar = ({
  className, src, alt, size, onClick,
} : AvatarProps) => {
  const classes = useStyles({ isClickable: onClick !== null });
  return (
    <MaterialAvatar
      className={`${classes.root} ${classes[size!]} ${className}`}
      src={src}
      alt={alt}
      onClick={onClick}
    />
  );
};

Avatar.defaultProps = {
  className: '',
  src: '',
  size: 'medium',
  onClick: null,
};

export default React.memo(Avatar);
