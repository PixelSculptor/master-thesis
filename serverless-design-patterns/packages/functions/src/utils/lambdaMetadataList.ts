import dotenv from 'dotenv';

dotenv.config();

const movieMetrics = [
    'mostFamous',
    'mostActiveUsers',
    'topRatedMovies',
    'worstRatedMovies',
    'theBestAndFamousMovies',
    'mostTopRateMovieList',
    'leastFamousMovies',
    'leastActiveUsers',
    'mostWorstRateMovieList'
] as const;

type LambdaMetadata = {
    lambdaName: string;
    metricName: (typeof movieMetrics)[number];
};

const lambdaMetadataList: LambdaMetadata[] = (
    process.env.COMPUTING_LAMBDA_NAMES as string
)
    .split(',')
    .map((lambdaName, index) => {
        return {
            lambdaName: lambdaName,
            metricName: movieMetrics[index]
        };
    });

export default lambdaMetadataList;
