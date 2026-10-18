import { useGameActions, useGamePlayState } from '@shared/lib/hooks';

import { GamePlayUI } from './GamePlayUI';

import type { Game } from '@shared/types';

type GamePlayProps = { game: Game };

export const GamePlay = ({ game }: GamePlayProps): React.JSX.Element => {
  const { answer, markSeen, finish } = useGameActions(game.id);
  const state = useGamePlayState(game);

  const handleCorrect = (): void => {
    const current = game.questions[state.currentIndex];
    if (!current) return;

    answer.mutate(
      {
        question_id: current.question.id,
        time_spent_seconds: state.timeSpent || undefined,
      },
      { onSuccess: () => state.markCorrect() }
    );
  };

  const handleWrong = (): void => {
    const current = game.questions[state.currentIndex];
    if (!current) return;
    markSeen.mutate(
      {
        question_id: current.question.id,
        time_spent_seconds: state.timeSpent || undefined,
      },
      { onSuccess: () => state.markWrong() }
    );
  };

  const handleFinish = (): void => {
    finish.mutate();
  };

  return (
    <GamePlayUI
      game={game}
      state={state}
      onCorrect={handleCorrect}
      onWrong={handleWrong}
      onFinish={handleFinish}
      isSubmitting={answer.isPending}
    />
  );
};
