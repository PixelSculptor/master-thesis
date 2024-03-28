import { describe, it, expect } from 'vitest';

import movies from '../mocks/movies.json';
import { theBestAndFamousMovies } from '../src/computing/theBestAndFamousMovies';

describe('Unit tests for theBestAndFamousMovies computing function', () => {
    it('should return sorted array of movies in descending order by num of ratings', () => {
        const result = theBestAndFamousMovies(movies);
        expect(result).toMatchObject([
            {
                movieId: '634',
                averageRating: 4.33,
                listOfRatings: [5.0, 3.5, 4.5],
                numOfRatings: 3,
            },
            {
                movieId: '534',
                averageRating: 3.17,
                listOfRatings: [3.0, 4.5, 2.0],
                numOfRatings: 3,
            },
            {
                movieId: '234',
                averageRating: 3.0,
                listOfRatings: [3.0],
                numOfRatings: 1,
            },
            {
                movieId: '124',
                averageRating: 2.5,
                listOfRatings: [2.5],
                numOfRatings: 1,
            },

            {
                movieId: '421',
                averageRating: 2.0,
                listOfRatings: [2.0],
                numOfRatings: 1,
            },

            {
                movieId: '623',
                averageRating: 2.0,
                listOfRatings: [2.0],
                numOfRatings: 1,
            },
        ]);
    });
});
