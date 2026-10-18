export const gameStatusLabel = (status: string): string => {
  switch (status) {
    case 'setup':
      return 'Черновик';
    case 'active':
      return 'Идёт';
    case 'finished':
      return 'Завершена';
    default:
      return status;
  }
};

export const gameStatusColor = (status: string): string => {
  switch (status) {
    case 'setup':
      return 'var(--soft-blue)';
    case 'active':
      return 'var(--easter-purple)';
    case 'finished':
      return 'var(--crocus-purple)';
    default:
      return 'var(--soft-blue)';
  }
};
