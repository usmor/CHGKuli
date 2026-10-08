import { useParams } from 'react-router-dom';

import { useQuestion } from '@/shared/lib/hooks';

import { QuestionDetailUI } from './QuestionDetailUI';

export const QuestionDetail = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const questionId = Number(id);

  const { data, isLoading, error } = useQuestion(questionId);

  if (isLoading) {
    return <QuestionDetailUI.Loading />;
  }

  if (error) {
    return <QuestionDetailUI.Error />;
  }

  return <QuestionDetailUI.Question question={data!} />;
};
