import { describe, it, expect } from 'vitest';

import movies from '../mocks/movies.json';
import {
    mostTopRateMovieList,
    mostWorstRateMovieList
} from '../src/computing/theMostBestAndWorstMarks';

describe('Unit tests for functions that compute movie list with the most top and worst marks', () => {
    it('Should return list of movies sorted by the most top marks', () => {
        const result = mostTopRateMovieList(movies);
        expect(result).toMatchObject([
            {
                movieId: '634',
                averageRating: 4.33,
                listOfRatings: [5.0, 3.5, 4.5]
            },
            {
                movieId: '534',
                averageRating: 3.17,
                listOfRatings: [3.0, 4.5, 2.0]
            },
            {
                movieId: '234',
                averageRating: 3.0,
                listOfRatings: [3.0]
            },
            {
                movieId: '124',
                averageRating: 2.5,
                listOfRatings: [2.5]
            },
            {
                movieId: '421',
                averageRating: 2.0,
                listOfRatings: [2.0]
            },
            {
                movieId: '623',
                averageRating: 2.0,
                listOfRatings: [2.0]
            }
        ]);
    });
    it('Should return list of movies sorted by the most worst marks', () => {
        const result = mostWorstRateMovieList(movies);
        expect(result).toMatchObject([
            {
                movieId: '421',
                averageRating: 2.0,
                listOfRatings: [2.0]
            },
            {
                movieId: '623',
                averageRating: 2.0,
                listOfRatings: [2.0]
            },
            {
                movieId: '124',
                averageRating: 2.5,
                listOfRatings: [2.5]
            },
            {
                movieId: '234',
                averageRating: 3.0,
                listOfRatings: [3.0]
            },
            {
                movieId: '534',
                averageRating: 3.17,
                listOfRatings: [3.0, 4.5, 2.0]
            },
            {
                movieId: '634',
                averageRating: 4.33,
                listOfRatings: [5.0, 3.5, 4.5]
            }
        ]);
    });
});
