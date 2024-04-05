import { Lambda } from 'aws-sdk';
import dotenv from 'dotenv';
import { Config } from 'sst/node/config';

import handler from '@serverless-design-patterns/core/handler';
import { LambdaPayload } from '../../types/ComputingTypes';

dotenv.config();

const lambda = new Lambda({
    region: 'eu-central-1'
});

export const main = handler(async (event) => {
    const bucketName = process.env.AWS_S3_MOVIEDATASET_BUCKET;

    if (process.env.COMPUTING_LAMBDA_NAMES === undefined) {
        return JSON.stringify({
            message: `No lambda names found `
        });
    }
    const lambdaNames = process.env.COMPUTING_LAMBDA_NAMES.split(',');

    const fanoutInvocations = lambdaNames.map(async (lambdaName) => {
        return new Promise(async (resolve, reject) => {
            try {
                const params: LambdaPayload = {
                    FunctionName: lambdaName,
                    InvocationType: 'Event',
                    Payload: JSON.stringify({
                        metricName: 'mostFamousMoviesMetric',
                        patternName: 'fanoutBasicPattern'
                    })
                };
                lambda.invoke(params).promise();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    });
    try {
        await Promise.all(fanoutInvocations);
        return JSON.stringify({ message: 'Successfully invoked all lambdas' });
    } catch (error) {
        return JSON.stringify({ message: 'Error invoking lambdas' });
    }
});
