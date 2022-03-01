import React, { useCallback } from 'react';
import {
  makeStyles, Card, CardMedia, CardContent, CardActionArea,
} from '@material-ui/core';
import { Typo } from '~components/index';
import { GameModeType } from '~types/index';

const useStyles = makeStyles({
  card: {
    width: '100%',
    height: '35vh',
    '&:hover': {
      color: '#208fea',
    },
  },
  image: {
    width: '100%',
    height: '15vh',
    objectFit: 'contain',
    paddingTop: '3em',
    filter: 'opacity(.5) drop-shadow(0 0 0 blue)',
    '&::-webkit-filter': 'opacity(.5) drop-shadow(0 0 0 blue)',
  },
  marginBottom: {
    marginBottom: '0.3em',
  },
});

type GameOptionCardProps = {
  option: GameModeType | 'WATCH',
  onClick: React.MouseEventHandler<HTMLButtonElement>,
};

type GameCardType = {
  alt: string,
  src: string,
  title: string,
  description: string,
}

const GameOptionCard = ({ option, onClick } : GameOptionCardProps) => {
  const classes = useStyles();

  const GameCard = React.memo(({
    alt, src, title, description,
  }: GameCardType) => (
    <>
      <CardMedia
        style={{
          width: 'auto',
          margin: '0 auto',
          maxHeight: '15vh',
          objectFit: 'contain',
          paddingTop: '3em',
          filter: 'opacity(.5) drop-shadow(0.01rem 0 0 blue)',
          WebkitFilter: 'opacity(.5) drop-shadow(0.01rem 0 0 blue)',
        }}
        component="img"
        alt={alt}
        image={src}
        title={title}
      />
      <CardContent>
        <Typo className={classes.marginBottom} variant="h5">{title}</Typo>
        <Typo variant="body1">{description}</Typo>
      </CardContent>
    </>
  ));

  const ClassicGame = () => (
    <GameCard
      alt="Join Classic Game"
      src="/images/normal.png"
      title="Classic Game"
      description="상대방보다 먼저 5점을 획득하면 이기는 게임입니다. 키보드 방향키로 탁구채를 조작하여 공을 상대방쪽으로 넘기세요."
    />
  );

  const SpeedGame = () => (
    <GameCard
      alt="Join Speed Game"
      src="/images/fast.png"
      title="Speed Game"
      description="공이 더 빨라졌습니다. 상대방보다 먼저 5점을 획득하여 당신의 실력을 증명하세요."
    />
  );

  const ReverseGame = () => (
    <GameCard
      alt="Join Reverse Game"
      src="/images/reverse.png"
      title="Reverse Game"
      description="키보드 조작을 반대로 해야하는 이벤트 모드입니다. 이벤트 모드에서 승리하여 또 다른 재미를 느껴보세요."
    />
  );

  const WatchGame = () => (
    <GameCard
      alt="Join Watch Game"
      src="/images/view.png"
      title="Watch Game"
      description="다른 사람들이 실시간으로 게임하는 것을 관전하세요."
    />
  );

  const ChooseOption = useCallback((opt: GameModeType | 'WATCH') => {
    switch (opt) {
      case 'WATCH':
        return (<WatchGame />);
      case 'SPEED':
        return (<SpeedGame />);
      case 'REVERSE':
        return (<ReverseGame />);
      case 'CLASSIC':
      default:
        return (<ClassicGame />);
    }
  }, []);

  return (
    <CardActionArea onClick={onClick}>
      <Card className={classes.card}>
        { ChooseOption(option) }
      </Card>
    </CardActionArea>
  );
};

export default GameOptionCard;
