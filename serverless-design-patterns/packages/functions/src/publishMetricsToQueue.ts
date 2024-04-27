import { metricNames, fileNames } from './utils/putObjectToS3';
import { SQS } from 'aws-sdk';

import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { Config } from 'sst/node/config';

const sqs = new SQS();

export const main = apiHandler(async (event) => {
    if (Config.AWS_S3_MOVIEDATASET_BUCKET === undefined) {
        return JSON.stringify({
            message: 'Error: AWS_S3_MOVIEDATASET_BUCKET is not defined'
        });
    }
    const moviePromises = fileNames.map(async (fileName) => {
        return metricNames.map(async (metricName) => {
            const params = {
                MessageBody: JSON.stringify({
                    numOfTry: event.queryStringParameters?.numOfTry ?? '1',
                    fileName,
                    metricName
                }),
                QueueUrl: Config.AWS_SQS_METRICS_QUEUE_URL
            };
            await sqs.sendMessage(params).promise();
        });
    });
    try {
        await Promise.all(moviePromises.flat());
        return JSON.stringify({ message: 'Messages was published' });
    } catch (error) {
        return JSON.stringify({ message: 'Error in publishing messages' });
    }
});
