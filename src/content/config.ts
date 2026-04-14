import { defineCollection, z } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

const blog = defineCollection({
  type: 'content',
  schema: rssSchema.extend({
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
