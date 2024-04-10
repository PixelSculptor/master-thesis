import workerHandler from '@serverless-design-patterns/core/workerHandler';
import { leastFamousMovies } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(leastFamousMovies, 'leastFamousMovies');
