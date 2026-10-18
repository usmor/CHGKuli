export const roundDown = (n: number, step: number): number =>
  Math.floor(n / step) * step;

export const formatStat = (n: number, step: number): string => {
  const rounded = roundDown(n, step);
  return `${rounded.toLocaleString('ru-RU')} +`;
};
