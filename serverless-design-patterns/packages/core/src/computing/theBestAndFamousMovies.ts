import {
    MovieRatingAndMostFamousType,
    MovieType,
} from '../../../types/MovieType';
import { roundToTwoDecimalPlaces } from '../utils/roundMarks';

function computePopularMovies(
    movieSet: MovieType[],
): MovieRatingAndMostFamousType[] {
    const mostFamousMovies = movieSet.reduce((movieRatings, movie) => {
        const movieRating = movieRatings.find(
            ({ movieId: movieToCompare }: MovieRatingAndMostFamousType) =>
                movieToCompare === movie.movieId,
        );
        if (movieRating) {
            movieRating.listOfRatings.push(movie.rating);
        } else {
            movieRatings.push({
                movieId: movie.movieId,
                averageRating: movie.rating,
                numOfRatings: 1,
                listOfRatings: [movie.rating],
            });
        }
        return movieRatings;
    }, [] as MovieRatingAndMostFamousType[]);

    return mostFamousMovies;
}

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

function computeTheBestPopularMovies(
    movieSet: MovieRatingAndMostFamousType[],
): MovieRatingAndMostFamousType[] {
    const bestPopularMovies = movieSet.map((movie) => {
        const averageRating = roundToTwoDecimalPlaces(
            movie.listOfRatings.reduce((sum, mark) => sum + mark, 0) /
                movie.listOfRatings.length,
        );
        return { ...movie, averageRating };
    });
    return bestPopularMovies;
}

export function theBestAndFamousMovies(
    movieSet: MovieType[],
): MovieRatingAndMostFamousType[] {
    const movieWithAllMarks = computePopularMovies(movieSet);
    const moviesAverageRatingList =
        computeTheBestPopularMovies(movieWithAllMarks);
    return sortMovies(
        sortMovies(moviesAverageRatingList, theMostPopularMoviesPredicate),
        theBestMoviesPredicate,
    );
}
