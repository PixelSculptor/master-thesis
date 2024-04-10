import workerHandler from '@serverless-design-patterns/core/workerHandler';
import { theBestAndFamousMovies } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(
    theBestAndFamousMovies,
    'theBestAndFamousMovies'
);
