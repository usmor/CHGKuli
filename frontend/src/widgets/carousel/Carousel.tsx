import { QuestionCard } from '@entities/index';

import { CarouselUI } from './CarouselUI';

import type { Question } from '@shared/types';

type CarouselProps = {
  questions: Question[];
};

export const Carousel = ({ questions }: CarouselProps): React.JSX.Element => {
  return (
    <CarouselUI
      items={questions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    />
  );
};
