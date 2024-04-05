import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

import metrics from '../../core/src/index';
import { fileNames, putObjectToS3 } from './utils/putObjectToS3';
import { MovieType } from '../../types/MovieType';
import { updateCounterTable } from './utils/updateTable';

dotenv.config();
const s3 = new S3();

export const handler: Handler = async (event) => {
    const { metricName, patternName } = event;
    const bucketName = process.env.AWS_S3_MOVIEDATASET_BUCKET as string;
    const moviePromises = fileNames.map(async (fileName) => {
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
            if (response.code === 400 && response.error)
                throw new Error(JSON.stringify(response));
            await updateCounterTable(patternName);
            console.log(`Successfully processed movieSet: ${fileName}.json`);
        } catch (error) {
            console.error('Error processing movieSet: ', error);
        }
    });
    try {
        await Promise.all(moviePromises);
        console.log('Successfully processed all movieSets');
    } catch (error) {
        console.error('Error processing movieSets', error);
    }
};
