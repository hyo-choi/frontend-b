import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typo from '../../atoms/Typo/Typo';

const useStyles = makeStyles({
  card: {
    width: '100%',
    height: '35vh',
    '&:hover': { color: '#208fea' },
  },
  cardActionMargin: {
    marginTop: '1em',
  },
  image: {
    width: '100%',
    height: '20vh',
    objectFit: 'contain',
  },
  marginBottom: {
    marginBottom: '0.3em',
  },
});

type GameOptionType = 'classic' | 'speed' | 'reverse' | 'watch';

type GameOptionCardProps = {
  option: GameOptionType,
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

  const GameCard = ({
    alt, src, title, description,
  }: GameCardType) => (
    <>
      <CardMedia
        className={classes.image}
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
  );

  const ClassicGame = () => (
    <GameCard
      alt="Join Classic Game"
      src="/images/PongNormal.png"
      title="Classic Game"
      description="상대방보다 먼저 5점을 획득하면 이기는 게임입니다. 키보드 방향키로 탁구채를 조작하여 공을 상대방쪽으로 넘기세요."
    />
  );

  const SpeedGame = () => (
    <GameCard
      alt="Join Speed Game"
      src="/images/PongSpeed.png"
      title="Speed Game"
      description="공이 더 빨라졌습니다. 상대방보다 먼저 5점을 획득하여 당신의 실력을 증명하세요."
    />
  );

  const ReverseGame = () => (
    <GameCard
      alt="Join Reverse Game"
      src="/images/ReverseArrowKeys.png"
      title="Reverse Game"
      description="키보드 조작을 반대로 해야하는 이벤트 모드입니다. 이벤트 모드에서 승리하여 또 다른 재미를 느껴보세요."
    />
  );

  const WatchGame = () => (
    <GameCard
      alt="Join Watch Game"
      src="/images/CuteEyes.png"
      title="Watch Game"
      description="다른 사람들이 실시간으로 게임하는 것을 관전하세요."
    />
  );

  const ChooseOption = (opt: GameOptionType) => {
    switch (opt) {
      case 'watch':
        return (<WatchGame />);
      case 'speed':
        return (<SpeedGame />);
      case 'reverse':
        return (<ReverseGame />);
      case 'classic':
      default:
        return (<ClassicGame />);
    }
  };

  return (
    <CardActionArea onClick={onClick} className={classes.cardActionMargin}>
      <Card className={classes.card}>
        { ChooseOption(option) }
      </Card>
    </CardActionArea>
  );
};

export default GameOptionCard;