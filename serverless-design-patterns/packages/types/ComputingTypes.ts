export type LambdaPayload = {
    FunctionName: string;
    InvocationType: string;
    Payload: string;
};

export type MetricName =
    | 'mostFamousMovies'
    | 'mostActiveUsers'
    | 'topRatedMovies'
    | 'worstRatedMovies'
    | 'theBestAndFamousMovies'
    | 'mostTopRateMovieList'
    | 'leastFamousMovies'
    | 'leastActiveUsers'
    | 'mostWorstRateMovieList';
