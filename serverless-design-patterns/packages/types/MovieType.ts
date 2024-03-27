export type MovieType = {
    userId: string;
    movieId: string;
    rating: number;
    timestamp: string;
};

export type MovieMostFamousType = Pick<MovieType, 'movieId'> & {
    numOfRatings: number;
};
