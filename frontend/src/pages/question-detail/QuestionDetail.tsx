import {
  useAuth,
  useQuestion,
  useQuestionProgress,
  useRandomQuestion,
} from '@shared/lib/hooks';
import { useParams } from 'react-router-dom';

import { QuestionDetailUI } from './QuestionDetailUI';

export const QuestionDetail = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const questionId = Number(id);

  const { data: question, isLoading, error } = useQuestion(questionId);

  const { isPassed, togglePassed } = useQuestionProgress(questionId);
  const { user } = useAuth();
  const { getRandomQuestion, isLoading: isRandomLoading } = useRandomQuestion();

  if (isLoading) {
    return <QuestionDetailUI.Loading />;
  }

  if (error) {
    return <QuestionDetailUI.Error />;
  }

  return (
    <QuestionDetailUI.Question
      question={question!}
      isPassed={isPassed}
      onTogglePassed={togglePassed}
      isAuthorized={Boolean(user)}
      onRandomQuestion={getRandomQuestion}
      isRandomLoading={isRandomLoading}
    />
  );
};
