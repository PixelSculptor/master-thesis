import workerHandler from '@serverless-design-patterns/core/workerHandler';
import { mostTopRateMovieList } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(mostTopRateMovieList);
