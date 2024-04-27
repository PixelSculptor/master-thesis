import queueHandler from '@serverless-design-patterns/core/queueHandler';
import * as mertics from '@serverless-design-patterns/core/index';

export const mostFamousMoviesHandler = queueHandler(
    mertics.mostFamousMovies,
    'mostFamousMovies'
);

export const mostActiveUsersHandler = queueHandler(
    mertics.mostActiveUsers,
    'mostActiveUsers'
);

export const topRatedMoviesHandler = queueHandler(
    mertics.topRatedMovies,
    'topRatedMovies'
);

export const worstRatedMoviesHandler = queueHandler(
    mertics.worstRatedMovies,
    'worstRatedMovies'
);

export const theBestAndFamousMoviesHandler = queueHandler(
    mertics.theBestAndFamousMovies,
    'theBestAndFamousMovies'
);

export const mostTopRateMovieListHandler = queueHandler(
    mertics.mostTopRateMovieList,
    'mostTopRateMovieList'
);

export const leastFamousMoviesHandler = queueHandler(
    mertics.leastFamousMovies,
    'leastFamousMovies'
);

export const leastActiveUsersHandler = queueHandler(
    mertics.leastActiveUsers,
    'leastActiveUsers'
);

export const mostWorstRateMovieListHandler = queueHandler(
    mertics.mostWorstRateMovieList,
    'mostWorstRateMovieList'
);
