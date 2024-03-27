import { MovieMostFamousType, MovieType } from '../../types/MovieType';

function countNumOfRatings(movieSet: MovieType[]): MovieMostFamousType[] {
    const countRatings = movieSet.reduce((acc, { movieId }) => {
        const foundMovie = acc.find(
            ({ movieId: movieToCompare }: MovieMostFamousType) =>
                movieToCompare === movieId,
        );
        if (foundMovie) {
            foundMovie.numOfRatings++;
        } else {
            acc.push({ movieId, numOfRatings: 1 });
        }
        return acc;
    }, [] as MovieMostFamousType[]);

    return sortMoviesByNumOfRatings(countRatings);
}

const sortMoviesByNumOfRatings = (
    movies: MovieMostFamousType[],
): MovieMostFamousType[] => {
    return [...movies].sort(
        (firstMovie, secondMovie) =>
            secondMovie.numOfRatings - firstMovie.numOfRatings,
    );
};

const sortMovies = <T>(
    movies: T[],
    compareFn: (firstMovie: T, secondMovie: T) => number,
): T[] => {
    return [...movies].sort(compareFn);
};

const compareDescending = (
    firstMovie: MovieMostFamousType,
    secondMovie: MovieMostFamousType,
): number => secondMovie.numOfRatings - firstMovie.numOfRatings;

const compareAscending = (
    firstMovie: MovieMostFamousType,
    secondMovie: MovieMostFamousType,
): number => firstMovie.numOfRatings - secondMovie.numOfRatings;

export function mostFamousMovies(movieSet: MovieType[]): MovieMostFamousType[] {
    return sortMovies(countNumOfRatings(movieSet), compareDescending);
}

export function leastFamousMovies(
    movieSet: MovieType[],
): MovieMostFamousType[] {
    return sortMovies(countNumOfRatings(movieSet), compareAscending);
}
