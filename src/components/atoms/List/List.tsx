import React, { ForwardedRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typo from '../Typo/Typo';

type StyleProps = {
  height: string,
  scroll: boolean,
};

const useStyles = makeStyles({
  root: {
    height: (props: StyleProps) => props.height,
    maxHeight: (props: StyleProps) => props.height,
    margin: '0.5em auto',
    backgroundColor: '#eee',
    borderRadius: '10px',
    padding: '5px !important',
    overflowX: 'hidden',
    overflowY: (props: StyleProps) => (props.scroll ? 'auto' : 'hidden'),
    '&::-webkit-scrollbar': {
      width: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'lightgray',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
    scrollbarColor: 'lightgray transparent',
  },
  empty: {
    color: 'gray',
  },
});

type ListProps = {
  height?: string,
  scroll?: boolean,
  reverse?: boolean,
  children?: React.ReactNode,
};

const List = React.forwardRef(({
  height, scroll, reverse, children,
}: ListProps, ref?: ForwardedRef<HTMLDivElement>) => {
  const classes = useStyles({ height, scroll } as StyleProps);
  return (
    <Grid
      item
      container
      ref={ref || null}
      style={{ position: 'relative' }}
      className={classes.root}
      direction={reverse ? 'column-reverse' : 'column'}
      justifyContent="flex-start"
      alignItems="stretch"
      wrap="nowrap"
      spacing={1}
      xs={12}
    >
      {children || (
        <Grid item container className={classes.empty} justifyContent="center" alignItems="center" xs={12}>
          <Typo>Empty</Typo>
        </Grid>
      )}
    </Grid>
  );
});

List.defaultProps = {
  height: '25vh',
  scroll: false,
  reverse: false,
  children: null,
};

export default List;
