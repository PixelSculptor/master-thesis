import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import {
    fileNames,
    putObjectToS3
} from '../../functions/src/utils/putObjectToS3';
import { addComputeLogToDB } from '../../functions/src/utils/addComputeLogToDB';
import { MovieType } from '../../types/MovieType';
// import dotenv from 'dotenv';
// dotenv.config();

const s3 = new S3();

export default function workerHandler<T>(
    metricWorker: (movieSet: MovieType[]) => T,
    metricName?: string
): Handler {
    return async (event) => {
        let patternName = '';
        let bucketName = '';
        let SNSPayload;
        const numOfTry = event.queryStringParameters?.tryNumber ?? '1';

        if (event.Records && event.Records.length > 0) {
            SNSPayload = JSON.parse(event?.Records[0].Sns.Message);
        }

        if (event.patternName && event.bucketName) {
            patternName = event.patternName;
            bucketName = event.bucketName;
        } else if (
            SNSPayload &&
            'patternName' in SNSPayload &&
            'bucketName' in SNSPayload
        ) {
            patternName = SNSPayload.patternName;
            bucketName = SNSPayload.bucketName;
        }

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

                const mostFamousMoviesMetric = metricWorker(movies);

                const response = await putObjectToS3(
                    `metrics/${patternName}/${fileName}/${metricName}.json`,
                    mostFamousMoviesMetric
                );
                if (response.code === 400 && response.error) {
                    throw new Error(JSON.stringify(response));
                }

                await addComputeLogToDB(
                    patternName,
                    numOfTry,
                    `${fileName}/${metricName}`
                );
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
}
