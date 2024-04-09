import { Lambda } from 'aws-sdk';

import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { LambdaPayload } from '../../types/ComputingTypes';

import lambdaMetadataList from './utils/lambdaMetadataList';

const lambda = new Lambda({
    region: 'eu-central-1'
});

export const main = apiHandler(async (event) => {
    if (process.env.COMPUTING_LAMBDA_NAMES === undefined) {
        return JSON.stringify({
            message: `No lambda names found `
        });
    }
    console.log(lambdaMetadataList);

    const fanoutInvocations = lambdaMetadataList.map(
        async ({ lambdaName, metricName }) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const params: LambdaPayload = {
                        FunctionName: lambdaName,
                        InvocationType: 'Event',
                        Payload: JSON.stringify({
                            metricName: metricName,
                            patternName: 'fanoutBasicPattern'
                        })
                    };
                    console.log(`Invoking lambda: ${lambdaName}`);
                    lambda.invoke(params).promise();
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
