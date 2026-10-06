import { ProgressBadge } from '@shared/ui';

import { QuestionCardUI } from './QuestionCardUI';

import type { Question } from '@shared/types';

type QuestionCardProps = {
  question: Question;
  previewLength?: number;
  isPassed?: boolean;
};

export const QuestionCard = ({
  question,
  previewLength,
  isPassed = false,
}: QuestionCardProps): React.JSX.Element => {
  return (
    <QuestionCardUI
      question={question}
      previewLength={previewLength}
      badge={<ProgressBadge isPassed={isPassed} />}
    />
  );
};
