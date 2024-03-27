export type MovieType = {
    userId: string;
    movieId: string;
    rating: number;
    timestamp: string;
};

export type MovieMostFamousType = Pick<MovieType, 'movieId'> & {
    numOfRatings: number;
};

export type UserType = Pick<MovieType, 'userId'> & {
    numOfReviews: number;
};
