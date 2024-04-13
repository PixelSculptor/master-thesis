import workerHandler from '@serverless-design-patterns/core/workerHandler';
import { worstRatedMovies } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(worstRatedMovies, 'worstRatedMovies');
