import {
    MovieRatingAndMostFamousType,
    MovieType,
} from '../../../types/MovieType';
import { computeAverageRatingMovies } from './topRatedMovies';

const theMostPopularMoviesPredicate = (
    firstMovie: MovieRatingAndMostFamousType,
    secondMovie: MovieRatingAndMostFamousType,
) => {
    const diff = secondMovie.numOfRatings - firstMovie.numOfRatings;
    return diff !== 0
        ? diff
        : firstMovie.movieId > secondMovie.movieId
        ? 1
        : -1;
};

const theBestMoviesPredicate = (
    firstMovie: MovieRatingAndMostFamousType,
    secondMovie: MovieRatingAndMostFamousType,
) => {
    const diff = secondMovie.averageRating - firstMovie.averageRating;
    return diff !== 0
        ? diff
        : firstMovie.movieId > secondMovie.movieId
        ? 1
        : -1;
};

const sortMovies = (
    movies: MovieRatingAndMostFamousType[],
    predicate: (
        first: MovieRatingAndMostFamousType,
        second: MovieRatingAndMostFamousType,
    ) => number,
) => {
    return [...movies].sort(predicate);
};

function computeTheBestMovies(
    movieSet: MovieType[],
): MovieRatingAndMostFamousType[] {
    const movieRatedList = computeAverageRatingMovies(movieSet);
    const movieRatedListWithCountedRatings = movieRatedList.map((movie) => ({
        ...movie,
        numOfRatings: movie.listOfRatings.length,
    }));
    return movieRatedListWithCountedRatings;
}

export function theBestAndFamousMovies(
    movieSet: MovieType[],
): MovieRatingAndMostFamousType[] {
    const moviesAverageRatingList = computeTheBestMovies(movieSet);
    return sortMovies(
        sortMovies(moviesAverageRatingList, theMostPopularMoviesPredicate),
        theBestMoviesPredicate,
    ).slice(0, 100);
}
