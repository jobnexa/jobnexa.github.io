import { defineCollection } from 'astro:content';
import { jobSchema } from './lib/content/schema';
import { jobsLoader } from './lib/content/loader';

const jobs = defineCollection({
  loader: jobsLoader(process.env.INCLUDE_SAMPLES === '1'),
  schema: jobSchema,
});

export const collections = { jobs };
