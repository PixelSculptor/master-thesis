import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket, Function, StackContext, Table } from 'sst/constructs';

export function StorageStack({ stack }: StackContext) {
    const table = new Table(stack, 'FinishExecution', {
        fields: {
            patternName: 'string',
            counter: 'number',
            timestamp: 'string'
        },
        primaryIndex: { partitionKey: 'patternName' }
    });

    const resourceBucket = new Bucket(stack, 'MovieDatasetBucket');

    const lambdaResourceManipulationRole = new iam.Role(
        stack,
        'LambdaResourceManipulationRole',
        {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'service-role/AWSLambdaBasicExecutionRole'
                )
            ]
        }
    );

    lambdaResourceManipulationRole.addToPolicy(
        new iam.PolicyStatement({
            actions: ['s3:*'],
            resources: [
                `${resourceBucket.bucketArn}`,
                `${resourceBucket.bucketArn}/*`
            ]
        })
    );

    lambdaResourceManipulationRole.addToPolicy(
        new iam.PolicyStatement({
            actions: ['dynamodb:*'],
            resources: [`${table.tableArn}`, `${table.tableArn}/*`]
        })
    );

    const simpleComputing = new Function(stack, 'SimpleComputing', {
        handler: 'packages/functions/src/simpleComputing.main',
        role: lambdaResourceManipulationRole,
        timeout: 100,
        memorySize: 256
    });

    return {
        table,
        resourceBucket,
        simpleComputing
    };
}
