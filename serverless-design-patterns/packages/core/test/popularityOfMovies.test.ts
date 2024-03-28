import { describe, it, expect } from 'vitest';
import {
    leastFamousMovies,
    mostFamousMovies,
} from '../src/computing/popularityOfMovies';
import movies from '../mocks/movies.json';

describe('Unit tests for mostFameousMovies util function', () => {
    it('should return sorted array of movies in descending order by num of ratings', () => {
        const result = mostFamousMovies(movies);
        expect(result).toMatchObject([
            {
                movieId: '534',
                numOfRatings: 3,
            },
            {
                movieId: '634',
                numOfRatings: 3,
            },
            {
                movieId: '124',
                numOfRatings: 1,
            },
            {
                movieId: '421',
                numOfRatings: 1,
            },
            {
                movieId: '234',
                numOfRatings: 1,
            },
            {
                movieId: '623',
                numOfRatings: 1,
            },
        ]);
    });
    it('should return sorted array of movies in ascending order', () => {
        const result = leastFamousMovies(movies);
        expect(result).toMatchObject([
            {
                movieId: '124',
                numOfRatings: 1,
            },
            {
                movieId: '421',
                numOfRatings: 1,
            },
            {
                movieId: '234',
                numOfRatings: 1,
            },
            {
                movieId: '623',
                numOfRatings: 1,
            },
            {
                movieId: '534',
                numOfRatings: 3,
            },
            {
                movieId: '634',
                numOfRatings: 3,
            },
        ]);
    });
});
