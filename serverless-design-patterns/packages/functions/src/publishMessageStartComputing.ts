import * as AWS from 'aws-sdk';
import { Config } from 'sst/node/config';
import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { PublishInput } from 'aws-sdk/clients/sns';
// TODO: Delete this import after research
// import dotenv from 'dotenv';
// dotenv.config();

const sns = new AWS.SNS();

export const main = apiHandler(async (event) => {
    const params: PublishInput = {
        Message: JSON.stringify({
            patternName: 'fanoutWithSNSPattern',
            bucketName: Config.AWS_S3_MOVIEDATASET_BUCKET
        }),
        TopicArn: Config.AWS_SNS_TOPIC
    };

    await sns.publish(params).promise();

    return JSON.stringify({ message: 'Message was published' });
});
