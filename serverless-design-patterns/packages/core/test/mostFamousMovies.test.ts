import { describe, it, expect } from 'vitest';
import { mostFamousMovies } from '../src/mostFamousMovies';
import movies from '../mocks/movies.json';

describe('Unit tests for mostFameousMovies util function', () => {
    it('should return sorted array of movies in descending order', () => {
        const result = mostFamousMovies(movies);
        expect(result).toEqual([
            {
                userId: '342',
                movieId: '534',
                rating: 3.0,
                numOfRatings: 3,
                timestamp: '123456789',
            },
            {
                userId: '531',
                movieId: '634',
                rating: 5.0,
                numOfRatings: 3,
                timestamp: '123456789',
            },
            {
                userId: '524',
                movieId: '124',
                rating: 2.5,
                numOfRatings: 1,
                timestamp: '123456789',
            },
            {
                userId: '267',
                movieId: '421',
                rating: 2.0,
                numOfRatings: 1,
                timestamp: '123456789',
            },
            {
                userId: '146',
                movieId: '234',
                rating: 3.0,
                numOfRatings: 1,
                timestamp: '123456789',
            },
            {
                userId: '146',
                movieId: '623',
                rating: 2.0,
                numOfRatings: 1,
                timestamp: '123456789',
            },
        ]);
    });
});
