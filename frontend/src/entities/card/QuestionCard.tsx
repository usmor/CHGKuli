import { useQuestionProgress } from '@shared/lib/hooks';
import { ProgressBadge } from '@shared/ui';

import { QuestionCardUI } from './QuestionCardUI';

import type { Question } from '@shared/types';

type QuestionCardProps = {
  question: Question;
  previewLength?: number;
  width?: number;
};

export const QuestionCard = ({
  question,
  previewLength,
  width = 400,
}: QuestionCardProps): React.JSX.Element => {
  const { isPassed } = useQuestionProgress(question.id);
  return (
    <QuestionCardUI
      question={question}
      previewLength={previewLength}
      width={width}
      badge={<ProgressBadge isPassed={isPassed} />}
    />
  );
};
