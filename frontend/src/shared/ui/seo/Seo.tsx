import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title: string;
  description?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
};

const SITE_NAME = 'ЧГКули';
const DEFAULT_DESCRIPTION =
  'Более 300 000 вопросов из тысяч турниров ЧГК. Ищите по автору, турниру и году, играйте с таймером, отмечайте пройденное.';
const SITE_URL = 'https://chgkuli.ru';

export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  type = 'website',
  noIndex = false,
}: SeoProps): React.JSX.Element => {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      {url && <meta property="og:url" content={`${SITE_URL}${url}`} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
