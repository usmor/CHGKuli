import { Carousel } from '@mantine/carousel';
import { Container, Title, Text } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, type ReactNode } from 'react';

import classes from './Carousel.module.css';

type CarouselUIProps = {
  items: ReactNode[];
};

export const CarouselUI = ({ items }: CarouselUIProps): React.JSX.Element => {
  console.log(classes);
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  return (
    <Container size="lg" className={classes.container}>
      <Title order={2} mb="md">
        Вопросы дня
      </Title>
      {items.length > 0 ? (
        <Carousel
          classNames={{
            control: classes.control,
            indicators: classes.indicators,
            indicator: classes.indicator,
          }}
          slideSize={{ base: '100%', sm: '50%', md: '33.333%' }}
          slideGap="md"
          withControls
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={() => autoplay.current.play()}
          emblaOptions={{ loop: false, slidesToScroll: 1 }}
        >
          {items.map((item, index) => (
            <Carousel.Slide key={index}>{item}</Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <Text className={classes.empty}> Скоро здесь появятся вопросы</Text>
      )}
    </Container>
  );
};
