import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { PublishInput } from 'aws-sdk/clients/sns';

dotenv.config();

const sns = new AWS.SNS();

export const main = apiHandler(async (event) => {
    // publish pattern name through SNS
    // add parameter for lambda with name of metric
    const params: PublishInput = {
        Message: JSON.stringify({ patternName: 'fanoutWithSNSPattern' }),
        TopicArn: process.env.AWS_SNS_TOPIC
    };

    await sns.publish(params).promise();

    return JSON.stringify({ message: 'Message was published' });
});
