import { mostFamousMovies } from '../../core/src/index';

import workerHandler from '@serverless-design-patterns/core/workerHandler';

export const handler = workerHandler(mostFamousMovies);
