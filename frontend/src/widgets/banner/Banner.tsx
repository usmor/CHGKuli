import { useSiteStats } from '@shared/lib/hooks';

import { BannerUI } from './BannerUI';

export const Banner = (): React.JSX.Element => {
  const { data: stats } = useSiteStats();
  return <BannerUI stats={stats} />;
};
