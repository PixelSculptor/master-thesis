import { MovieRatingType, MovieType } from '../../../types/MovieType';
import { computeAverageRatingMovies } from './topRatedMovies';

export function mostTopRateMovieList(movieSet: MovieType[]): MovieRatingType[] {
    const ratedList = computeAverageRatingMovies(movieSet);
    return [...ratedList].sort((firstMovie, secondMovie) => {
        const diff =
            mostTopMarks(secondMovie.listOfRatings) -
            mostTopMarks(firstMovie.listOfRatings);
        if (diff !== 0) {
            return diff;
        } else if (secondMovie.averageRating - firstMovie.averageRating !== 0) {
            return secondMovie.averageRating - firstMovie.averageRating;
        } else {
            return firstMovie.movieId > secondMovie.movieId ? 1 : -1;
        }
    });
}

export function mostWorstRateMovieList(
    movieSet: MovieType[]
): MovieRatingType[] {
    const ratedList = computeAverageRatingMovies(movieSet);
    return [...ratedList].sort((firstMovie, secondMovie) => {
        const diff =
            mostWorstMarks(firstMovie.listOfRatings) -
            mostWorstMarks(secondMovie.listOfRatings);
        if (diff !== 0) {
            return diff;
        } else if (firstMovie.averageRating - secondMovie.averageRating !== 0) {
            return firstMovie.averageRating - secondMovie.averageRating;
        } else {
            return firstMovie.movieId > secondMovie.movieId ? 1 : -1;
        }
    });
}

const mostTopMarks = (movieMarks: number[]): number => {
    return movieMarks.reduce(
        (acc, mark) => (acc = mark > 4.0 ? acc + 1 : acc),
        0
    );
};

const mostWorstMarks = (movieMarks: number[]): number => {
    return movieMarks.reduce(
        (acc, mark) => (acc = mark < 2.0 ? acc + 1 : acc),
        0
    );
};
