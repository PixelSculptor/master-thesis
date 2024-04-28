import * as AWS from 'aws-sdk';
import { Config } from 'sst/node/config';
import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { PublishInput } from 'aws-sdk/clients/sns';

const sns = new AWS.SNS();

export const main = apiHandler(async (event) => {
    if (Config.AWS_S3_MOVIEDATASET_BUCKET === undefined) {
        return JSON.stringify({
            message: 'Error: AWS_S3_MOVIEDATASET_BUCKET is not defined'
        });
    }
    const params: PublishInput = {
        Message: JSON.stringify({
            patternName: 'fanoutWithSNSPattern',
            bucketName: Config.AWS_S3_MOVIEDATASET_BUCKET,
            numOfTry: event.queryStringParameters?.tryNumber ?? '1'
        }),
        TopicArn: Config.AWS_SNS_TOPIC
    };

    await sns.publish(params).promise();

    return JSON.stringify({ message: 'Message was published' });
});
