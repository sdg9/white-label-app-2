import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  outDir: './dist',

  integrations: [
    starlight({
      title: 'White Label App v2 Docs',
      description: 'Documentation for the white-label mobile app platform v2',

      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Guides',
          items: [
            { label: 'Navigation', link: '/guides/navigation/' },
          ],
        },
      ],

      pagefind: true,
    }),
  ],
});
