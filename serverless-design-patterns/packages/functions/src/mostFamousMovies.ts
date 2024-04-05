import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import metrics from '../../core/src/index';
import { fileNames, putObjectToS3 } from './utils/putObjectToS3';
import { MovieType } from '../../types/MovieType';
import { Config } from 'sst/node/config';

const s3 = new S3();

export const handler: Handler = async (event) => {
    const { metricName, patternName } = event;
    const bucketName = Config.AWS_S3_MOVIEDATASET_BUCKET;
    const moviePromises = fileNames.map(async (fileName) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await s3
                    .getObject({
                        Bucket: bucketName,
                        Key: `${fileName}.json`
                    })
                    .promise();

                if (data.Body === undefined) throw new Error('No data in file');
                const movies: MovieType[] = JSON.parse(data.Body.toString());

                const mostFamousMoviesMetric = metrics.mostFamousMovies(movies);

                const response = await putObjectToS3(
                    `metrics/${patternName}/${fileName}/${metricName}.json`,
                    mostFamousMoviesMetric
                );
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    });
    try {
        await Promise.all(moviePromises);
        console.log('Successfully processed all movieSets');
    } catch (error) {
        console.error('Error processing movieSets', error);
    }
};
