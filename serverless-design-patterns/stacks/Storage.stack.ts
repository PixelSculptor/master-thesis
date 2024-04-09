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

    const lambdaInvocationRole = new iam.Role(stack, 'LambdaInvocationRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                'service-role/AWSLambdaBasicExecutionRole'
            )
        ]
    });

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

    const mostFamousMovies = new Function(stack, 'mostFamousMovies', {
        handler: 'packages/functions/src/mostFamousMovies.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const mostActiveUsers = new Function(stack, 'mostActiveUsers', {
        handler: 'packages/functions/src/mostActiveUsers.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const topRatedMovies = new Function(stack, 'topRatedMovies', {
        handler: 'packages/functions/src/topRatedMovies.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const worstRatedMovies = new Function(stack, 'worstRatedMovies', {
        handler: 'packages/functions/src/worstRatedMovies.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const theBestAndFamousMovies = new Function(
        stack,
        'theBestAndFamousMovies',
        {
            handler: 'packages/functions/src/theBestAndFamousMovies.handler',
            timeout: 100,
            role: lambdaResourceManipulationRole,
            memorySize: 256
        }
    );

    const mostTopRateMovieList = new Function(stack, 'mostTopRateMovieList', {
        handler: 'packages/functions/src/mostTopRateMovieList.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const leastFamousMovies = new Function(stack, 'leastFamousMovies', {
        handler: 'packages/functions/src/leastFamousMovies.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const leastActiveUsers = new Function(stack, 'leastActiveUsers', {
        handler: 'packages/functions/src/leastActiveUsers.handler',
        timeout: 100,
        role: lambdaResourceManipulationRole,
        memorySize: 256
    });

    const mostWorstRateMovieList = new Function(
        stack,
        'mostWorstRateMovieList',
        {
            handler: 'packages/functions/src/mostWorstRateMovieList.handler',
            timeout: 100,
            role: lambdaResourceManipulationRole,
            memorySize: 256
        }
    );

    lambdaInvocationRole.addToPolicy(
        new iam.PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [mostFamousMovies.functionArn]
        })
    );

    const basicFanout = new Function(stack, 'fanoutEntry', {
        handler: 'packages/functions/src/fanoutEntry.main',
        timeout: 60,
        memorySize: 256,
        role: lambdaInvocationRole
    });

    return {
        table,
        resourceBucket,
        simpleComputing,
        basicFanout,
        mostFamousMovies,
        mostActiveUsers,
        topRatedMovies,
        worstRatedMovies,
        theBestAndFamousMovies,
        mostTopRateMovieList,
        leastFamousMovies,
        leastActiveUsers,
        mostWorstRateMovieList
    };
}
