import { Text } from '@mantine/core';

import classes from './Stat.module.css';

type StatProps = {
  value: string;
  label: string;
};

export const Stat = ({ value, label }: StatProps): React.JSX.Element => (
  <div>
    <Text className={classes.statValue}>{value}</Text>
    <Text className={classes.statLabel}>{label}</Text>
  </div>
);
