import { MovieType, MovieRatingType } from '../../../types/MovieType';
import { roundToTwoDecimalPlaces } from '../utils/roundMarks';

function gatherMarks(movieSet: MovieType[]): MovieRatingType[] {
    const movieAverageRating = movieSet.reduce((movieRatings, movie) => {
        const movieRating = movieRatings.find(
            ({ movieId: movieToCompare }: MovieRatingType) =>
                movieToCompare === movie.movieId,
        );
        if (movieRating) {
            movieRating.listOfRatings.push(movie.rating);
        } else {
            movieRatings.push({
                movieId: movie.movieId,
                averageRating: movie.rating,
                listOfRatings: [movie.rating],
            });
        }
        return movieRatings;
    }, [] as MovieRatingType[]);

    return movieAverageRating;
}

const topRatedMoviesAscending = (
    firstMovie: MovieRatingType,
    secondMovie: MovieRatingType,
) => {
    const diff = firstMovie.averageRating - secondMovie.averageRating;
    return diff !== 0
        ? diff
        : firstMovie.movieId > secondMovie.movieId
        ? 1
        : -1;
};

const topRatedMoviesDescending = (
    firstMovie: MovieRatingType,
    secondMovie: MovieRatingType,
) => {
    const diff = secondMovie.averageRating - firstMovie.averageRating;
    return diff !== 0
        ? diff
        : firstMovie.movieId > secondMovie.movieId
        ? 1
        : -1;
};

const sortTopRatingMovies = (movieAverageRating: MovieRatingType[]) =>
    [...movieAverageRating].sort(topRatedMoviesDescending);

const sortWorstRatedMovies = (movieAverageRating: MovieRatingType[]) =>
    [...movieAverageRating].sort(topRatedMoviesAscending);

function computeAverageRatingMovies(movieSet: MovieType[]): MovieRatingType[] {
    const movieWithAllMarks = gatherMarks(movieSet);
    const moviesAverageRatingList = movieWithAllMarks.map(
        ({ movieId, listOfRatings }) => {
            const averageRating = roundToTwoDecimalPlaces(
                listOfRatings.reduce((sum, rating) => sum + rating, 0) /
                    listOfRatings.length,
            );
            return { movieId, averageRating, listOfRatings };
        },
    );
    return moviesAverageRatingList;
}

export function topRatedMovies(movies: MovieType[]): MovieRatingType[] {
    return sortTopRatingMovies(computeAverageRatingMovies(movies));
}

export function worstRatedMovies(movies: MovieType[]): MovieRatingType[] {
    return sortWorstRatedMovies(computeAverageRatingMovies(movies));
}
