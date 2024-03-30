import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket, Function, StackContext, Table } from 'sst/constructs';

export function StorageStack({ stack }: StackContext) {
    const table = new Table(stack, 'FinishExecution', {
        fields: {
            patternName: 'string',
            counter: 'number',
            timestamp: 'string'
        },
        primaryIndex: { partitionKey: 'patternName', sortKey: 'counter' }
    });

    const resourceBucket = new Bucket(stack, 'MovieDatasetBucket');

    const s3ManipulationRole = new iam.Role(
        stack,
        'LambdaS3ManipulationRole2',
        {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'service-role/AmazonS3ObjectLambdaExecutionRolePolicy'
                )
            ]
        }
    );

    s3ManipulationRole.addToPolicy(
        new iam.PolicyStatement({
            actions: ['s3:*'],
            resources: [`${resourceBucket.bucketArn}/*`]
        })
    );

    const simpleComputing = new Function(stack, 'SimpleComputing', {
        handler: 'packages/functions/src/simpleComputing.main',
        role: s3ManipulationRole
    });

    simpleComputing.attachPermissions([resourceBucket]);

    // TODO: doesn't work
    // simpleComputing.attachPermissions([
    //     new iam.PolicyStatement({
    //         actions: ['s3:GetObject', 's3:PutObject'],
    //         effect: iam.Effect.ALLOW,
    //         resources: [`${resourceBucket.bucketArn}/*`]
    //     })
    // ]);

    return {
        table,
        resourceBucket,
        simpleComputing
    };
}
