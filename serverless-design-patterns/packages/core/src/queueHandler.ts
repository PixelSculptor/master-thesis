import { Handler, SQSEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import { MovieType } from '../../types/MovieType';
import { MessageBodyType } from '../../types/MessageType';
import { Config } from 'sst/node/config';
import {
    fileNames,
    putObjectToS3
} from '../../functions/src/utils/putObjectToS3';
import { addComputeLogToDB } from '../../functions/src/utils/addComputeLogToDB';
import { MetricName } from '../../types/ComputingTypes';

const s3 = new S3();

type FanoutMessage = {
    numOfTry: string;
    patternName: string;
};

export default function queueHandler<T>(
    metricWorker: (movieSet: MovieType[]) => T,
    movieMetric: MetricName
): Handler {
    return async (event: SQSEvent) => {
        const messageBody: FanoutMessage = JSON.parse(
            JSON.parse(event.Records[0].body).Message
        );
        const moviePromises = fileNames.map(async (fileName) => {
            try {
                const data = await s3
                    .getObject({
                        Bucket: Config.AWS_S3_MOVIEDATASET_BUCKET,
                        Key: `${fileName}.json`
                    })
                    .promise();

                if (data.Body === undefined) throw new Error('No data in file');

                const movies: MovieType[] = JSON.parse(data.Body.toString());

                const computedMetric = metricWorker(movies);

                const response = await putObjectToS3(
                    `metrics/fanoutWithSNSandSQSpattern/${fileName}/${movieMetric}.json`,
                    computedMetric
                );

                if (response.code === 400 && response.error) {
                    throw new Error(response.error);
                }

                await addComputeLogToDB(
                    'fanoutWithSNSandSQSPattern',
                    messageBody.numOfTry,
                    `${fileName}/${movieMetric}`
                );
            } catch (error) {
                console.error('Error in processing message: ', error);
            }
        });

        try {
            await Promise.all(moviePromises);
            console.log('Successfully processed all messages');
        } catch (error) {
            console.error('Error processing messages: ', error);
        }
    };
}
