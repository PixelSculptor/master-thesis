import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

import apiHandler from '../../core/src/apiHandler';
import {
    mostFamousMovies,
    mostActiveUsers,
    topRatedMovies,
    worstRatedMovies,
    theBestAndFamousMovies,
    mostTopRateMovieList,
    leastFamousMovies,
    leastActiveUsers,
    mostWorstRateMovieList
} from '../../core/src/index';
import { putObjectToS3 } from './utils/putObjectToS3';
import { updateCounterTable } from './utils/updateTable';
import { addComputeLogToDB } from './utils/addComputeLogToDB';
import { fileNames } from './utils/putObjectToS3';

import { MovieType } from '../../types/MovieType';

dotenv.config();
const s3 = new S3();

export const main = apiHandler(async (event) => {
    const bucketName = process.env.AWS_S3_MOVIEDATASET_BUCKET as string;
    const numberOfTry = event.queryStringParameters?.tryNumber ?? '1';

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

            const mostFamousMetric = mostFamousMovies(movies);
            const mostActiveUsersMetric = mostActiveUsers(movies);
            const topRatedMoviesMetric = topRatedMovies(movies);
            const worstRatedMoviesMetric = worstRatedMovies(movies);
            const theBestAndFamousMoviesMetric = theBestAndFamousMovies(movies);
            const mostTopRateMovieListMetric = mostTopRateMovieList(movies);
            const leastFamousMoviesMetric = leastFamousMovies(movies);
            const leastActiveUsersMetric = leastActiveUsers(movies);
            const mostWorstRateMovieListMetric = mostWorstRateMovieList(movies);

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/mostFamousMetric.json`,
                mostFamousMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/mostActiveUsersMetric.json`,
                mostActiveUsersMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/topRatedMoviesMetric.json`,
                topRatedMoviesMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/worstRatedMoviesMetric.json`,
                worstRatedMoviesMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/theBestAndFamousMoviesMetric.json`,
                theBestAndFamousMoviesMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/mostTopRateMovieListMetric.json`,
                mostTopRateMovieListMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/leastFamousMoviesMetric.json`,
                leastFamousMoviesMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/leastActiveUsersMetric.json`,
                leastActiveUsersMetric
            );

            putObjectToS3(
                `metrics/simpleComputingPattern/${filename}/mostWorstRateMovieListMetric.json`,
                mostWorstRateMovieListMetric
            );

            await addComputeLogToDB(
                'simpleComputingPattern',
                numberOfTry,
                `allMetrics/${filename}`
            );
            console.log(`Finish processing ${filename}.json`);
        } catch (error) {
            if (error instanceof Error) console.log(error.message);
        }
    });
    try {
        await Promise.all(moviePromises);
        console.log('All files are processed!');
        return JSON.stringify({
            message: 'End from simple computing pattern!'
        });
    } catch (error) {
        console.log('Error while processing files:', error);
        return JSON.stringify({ message: 'Error while processing files!' });
    }
});
