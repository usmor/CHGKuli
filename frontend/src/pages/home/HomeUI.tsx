import { Banner, Carousel } from '@/widgets';

import type { Question } from '@shared/types';

import classes from './Home.module.css';

type HomeUIProps = {
  questions: Question[];
};

export const HomeUI = ({ questions }: HomeUIProps): React.JSX.Element => {
  return (
    <div className={classes.content}>
      <Banner />
      <Carousel questions={questions} />
    </div>
  );
};
