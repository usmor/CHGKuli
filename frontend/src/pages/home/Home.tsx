import { mockQuestions } from '@/mocks/questions';

import { HomeUI } from './HomeUI';

export const Home = (): React.JSX.Element => {
  const questions = mockQuestions;
  return <HomeUI questions={questions} />;
};
