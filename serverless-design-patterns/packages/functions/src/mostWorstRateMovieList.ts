import workerHandler from '@serverless-design-patterns/core/workerHandler';
import { mostWorstRateMovieList } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(
    mostWorstRateMovieList,
    'mostWorstRateMovieList'
);
