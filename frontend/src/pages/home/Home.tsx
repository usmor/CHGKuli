import { useDailyQuestions } from '@shared/lib/hooks';

import { HomeUI } from './HomeUI';

export const Home = (): React.JSX.Element => {
  const { data, isLoading, isError } = useDailyQuestions(10);
  return <HomeUI questions={data ?? []} isLoading={isLoading} isError={isError} />;
};
