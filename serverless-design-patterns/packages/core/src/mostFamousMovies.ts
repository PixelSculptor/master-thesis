import { MovieMostFamousType, MovieType } from '../../types/MovieType';

export function mostFamousMovies(movieSet: MovieType[]): MovieMostFamousType[] {
    const countRatings = movieSet.reduce((acc, movie) => {
        const foundMovie = acc.find(
            ({ movieId }: MovieType) => movieId === movie.movieId,
        );
        if (foundMovie) {
            foundMovie.numOfRatings++;
        } else {
            acc.push({ ...movie, numOfRatings: 1 });
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
