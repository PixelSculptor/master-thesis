import { Config } from 'sst/node/config';
import SNS, { PublishInput } from 'aws-sdk/clients/sns';

import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { fileNames } from 'src/utils/putObjectToS3';

const topics = [
    Config.AWS_SNS_MostFamous_TOPIC,
    Config.AWS_SNS_MostActive_TOPIC,
    Config.AWS_SNS_TopRated_TOPIC,
    Config.AWS_SNS_WorstRated_TOPIC,
    Config.AWS_SNS_BestFamous_TOPIC,
    Config.AWS_SNS_LeastActive_TOPIC,
    Config.AWS_SNS_LeastFamous_TOPIC,
    Config.AWS_SNS_MostWorstRated_TOPIC,
    Config.AWS_SNS_MostTopRated_TOPIC
];

const sns = new SNS();

export const main = apiHandler(async (event) => {
    if (Config.AWS_S3_MOVIEDATASET_BUCKET === undefined) {
        return JSON.stringify({
            message: 'Error: AWS_S3_MOVIEDATASET_BUCKET is not defined'
        });
    }

    try {
        const moviePromises = topics.map(async (topicArn) => {
            const params: PublishInput = {
                Message: JSON.stringify({
                    numOfTry: event.queryStringParameters?.tryNumber ?? '1',
                    patternName: 'fanoutWithSNSandSQSPattern'
                }),
                TopicArn: topicArn
            };
            return sns.publish(params).promise();
        });
        await Promise.all(moviePromises);
        console.log('Messages were published');
        return JSON.stringify({ message: 'Messages were published' });
    } catch (error) {
        console.log(error);
        return JSON.stringify({ message: 'Error in publishing message' });
    }
});
