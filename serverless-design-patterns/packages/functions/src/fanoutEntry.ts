import { Lambda } from 'aws-sdk';
import { Config } from 'sst/node/config';

import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { LambdaPayload } from '../../types/ComputingTypes';
import lambdaMetadataList from './utils/lambdaMetadataList';

const lambda = new Lambda({
    region: 'eu-central-1'
});

export const main = apiHandler(async (event) => {
    if (Config.AWS_S3_MOVIEDATASET_BUCKET === undefined) {
        return JSON.stringify({
            message: 'Error: AWS_S3_MOVIEDATASET_BUCKET is not defined'
        });
    }
    const fanoutInvocations = lambdaMetadataList.map(
        async ({ lambdaName, metricName }) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const params: LambdaPayload = {
                        FunctionName: lambdaName,
                        InvocationType: 'Event',
                        Payload: JSON.stringify({
                            metricName: metricName,
                            patternName: 'fanoutBasicPattern',
                            bucketName: Config.AWS_S3_MOVIEDATASET_BUCKET
                        })
                    };
                    console.log(`Invoking lambda: ${lambdaName}`);
                    await lambda.invoke(params).promise();
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        }
    );
    try {
        await Promise.all(fanoutInvocations);
        return JSON.stringify({ message: 'Successfully invoked all lambdas' });
    } catch (error) {
        return JSON.stringify({ message: 'Error invoking lambdas' });
    }
});
