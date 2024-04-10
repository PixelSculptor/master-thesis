import workerHandler from '@serverless-design-patterns/core/workerHandler';

import { topRatedMovies } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(topRatedMovies, 'topRatedMovies');
