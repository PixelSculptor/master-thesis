import { S3 } from 'aws-sdk';
import { Config } from 'sst/node/config';

import handler from '../../core/src/handler';
import metrics from '../../core/src/index';
import { MovieType } from '../../types/MovieType';

const s3 = new S3();

export const main = handler(async (event) => {
    // Get Data from S3 in loop - done
    // For each file in the bucket perform set of tasks - done
    // After computing data on each file count up counter in DynamoDB
    const fileNames = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J'
    ] as const;
    // TODO: Get bucket name from secrets
    const bucketName = Config.AWS_S3_MOVIEDATASET_BUCKET;
    const moviePromises = fileNames.map(async (filename) => {
        try {
            const data = await s3
                .getObject({
                    Bucket: bucketName,
                    Key: `${filename}.json`
                })
                .promise();
            if (data.Body === undefined) throw new Error('No data in file');
            const movies: MovieType[] = JSON.parse(data.Body.toString());
            const mostFamousMetric = metrics.mostFamousMovies(movies);
            const mostActiveUsersMetric = metrics.mostActiveUsers(movies);
            const topRatedMoviesMetric = metrics.topRatedMovies(movies);
            const worstRatedMoviesMetric = metrics.worstRatedMovies(movies);
            const theBestAndFamousMoviesMetric =
                metrics.theBestAndFamousMovies(movies);
            const mostTopRateMovieListMetric =
                metrics.mostTopRateMovieList(movies);
            const leastFamousMoviesMetric = metrics.leastFamousMovies(movies);
            const leastActiveUsersMetric = metrics.leastActiveUsers(movies);
            const mostWorstRateMovieListMetric =
                metrics.mostWorstRateMovieList(movies);
            console.log('---------------------------------');
            console.log(`Movies metrics by movies portal: ${filename}`);
            console.log('Most Active users: ', mostActiveUsersMetric[0]);
            console.log('Most Famous movies: ', mostFamousMetric[0]);
            console.log('Top Rated movies: ', topRatedMoviesMetric[0]);
            console.log('Worst Rated movies: ', worstRatedMoviesMetric[0]);
            console.log(
                'The Best And Famous movies: ',
                theBestAndFamousMoviesMetric[0]
            );
            console.log(
                'Most Top Rate Movie List: ',
                mostTopRateMovieListMetric[0]
            );
            console.log(
                'Most Worst Rate Movie List: ',
                mostWorstRateMovieListMetric[0]
            );
            console.log('Least Famous Movies: ', leastFamousMoviesMetric[0]);
            console.log('Least Active Users: ', leastActiveUsersMetric[0]);
            console.log('---------------------------------');
        } catch (error) {
            if (error instanceof Error) console.log(error.message);
        }
    });

    await Promise.all(moviePromises);

    return JSON.stringify({ message: 'End from simple computing pattern!' });
});
