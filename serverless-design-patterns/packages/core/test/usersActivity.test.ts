import { describe, it, expect } from 'vitest';

import { mostActiveUsers, leastActiveUsers } from '../src/usersAcivity';
import movies from '../mocks/movies.json';

describe('Users Activity unit tests', () => {
    it('should return array of users sorted by activity (num of ratings)', () => {
        const result = mostActiveUsers(movies);
        expect(result).toMatchObject([
            {
                userId: '146',
                numOfReviews: 3,
            },
            {
                userId: '123',
                numOfReviews: 2,
            },
            {
                userId: '531',
                numOfReviews: 2,
            },
            {
                userId: '342',
                numOfReviews: 1,
            },
            {
                userId: '523',
                numOfReviews: 1,
            },
            {
                userId: '524',
                numOfReviews: 1,
            },
        ]);
    });
    it('should return array of users sorted by activity (num of ratings) in ascending order', () => {
        const result = leastActiveUsers(movies);
        expect(result).toMatchObject([
            {
                userId: '342',
                numOfReviews: 1,
            },
            {
                userId: '523',
                numOfReviews: 1,
            },
            {
                userId: '524',
                numOfReviews: 1,
            },
            {
                userId: '123',
                numOfReviews: 2,
            },
            {
                userId: '531',
                numOfReviews: 2,
            },
            {
                userId: '146',
                numOfReviews: 3,
            },
        ]);
    });
});
