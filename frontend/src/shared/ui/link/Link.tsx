import { Anchor, type AnchorProps } from '@mantine/core';
import { forwardRef } from 'react';

type LinkProps = AnchorProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    text: string;
  };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, text, ...rest }, ref) => {
    return (
      <Anchor ref={ref} href={href} {...rest}>
        {text}
      </Anchor>
    );
  }
);

Link.displayName = 'Link';
