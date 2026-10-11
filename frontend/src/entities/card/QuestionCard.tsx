import { useQuestionProgress } from '@shared/lib/hooks';
import { ProgressBadge } from '@shared/ui';

import { QuestionCardUI } from './QuestionCardUI';

import type { Question } from '@shared/types';

type QuestionCardProps = {
  question: Question;
  previewLength?: number;
};

export const QuestionCard = ({
  question,
  previewLength,
}: QuestionCardProps): React.JSX.Element => {
  const { isPassed } = useQuestionProgress(question.id);
  return (
    <QuestionCardUI
      question={question}
      previewLength={previewLength}
      badge={<ProgressBadge isPassed={isPassed} />}
    />
  );
};
