import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Nunito Sans Variable, system-ui, sans-serif',
  headings: {
    fontFamily: 'Montserrat Variable, system-ui, sans-serif',
    sizes: {
      h1: { fontSize: '40px', lineHeight: '1', fontWeight: '700' },
      h2: { fontSize: '38px', lineHeight: '1.3', fontWeight: '600' },
      h3: { fontSize: '36px', lineHeight: '1.4', fontWeight: '600' },
      h4: { fontSize: '32px', lineHeight: '1.4', fontWeight: '500' },
      h5: { fontSize: '28px', lineHeight: '1.6', fontWeight: '500' },
    },
  },
});
