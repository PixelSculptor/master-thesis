export type MovieType = {
    userId: string;
    movieId: string;
    rating: number;
    timestamp: string;
};

export type MovieMostFamousType = MovieType & {
    numOfRatings: number;
};
