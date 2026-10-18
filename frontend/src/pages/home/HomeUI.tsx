import { CustomAlert, CustomLoader, Seo } from '@shared/ui';

import { Banner, Carousel } from '@/widgets';

import type { Question } from '@/shared/types';

import classes from './Home.module.css';

type HomeUIProps = {
  questions: Question[];
  isLoading: boolean;
  isError: boolean;
};

export const HomeUI = ({
  questions,
  isLoading,
  isError,
}: HomeUIProps): React.JSX.Element => {
  return (
    <>
      <Seo title="ЧГКули — база вопросов «Что? Где? Когда?»" />
      <div className={classes.content}>
        <Banner />
        <div className={classes.carouselContainer}>
          {isError && (
            <CustomAlert
              title="Не удалось загрузить вопросы дня"
              message="Попробуйте перезагрузить страницу позже"
            />
          )}

          {isLoading && !isError && <CustomLoader />}

          {!isLoading && !isError && <Carousel questions={questions} />}
        </div>
      </div>
    </>
  );
};
