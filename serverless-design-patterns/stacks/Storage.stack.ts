import * as iam from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
    Bucket,
    Function,
    Queue,
    StackContext,
    Table,
    Topic
} from 'sst/constructs';

export function StorageStack({ stack }: StackContext) {
    const table = new Table(stack, 'FinishExecutionTable', {
        fields: {
            patternName: 'string',
            numberOfTry: 'string',
            metricName: 'string',
            timestamp: 'string'
        },
        primaryIndex: { partitionKey: 'patternName', sortKey: 'timestamp' }
    });

    const resourceBucket = new Bucket(stack, 'MovieDatasetBucket');

    // Fanout with SNS and SQS

    const mostFamousMoviesDlq = new Queue(stack, 'MostFamousMoviesDLQ');
    const mostActiveUsersDlq = new Queue(stack, 'MostActiveUsersDLQ');
    const mostTopRateMovieListDlq = new Queue(stack, 'MostTopRateMovieListDLQ');
    const mostWorstRateMovieListDlq = new Queue(
        stack,
        'MostWorstRateMovieListDLQ'
    );
    const theBestAndFamousMoviesDlq = new Queue(
        stack,
        'TheBestAndFamousMoviesDLQ'
    );
    const topRatedMoviesDlq = new Queue(stack, 'TopRatedMoviesDLQ');
    const worstRatedMoviesDlq = new Queue(stack, 'WorstRatedMoviesDLQ');
    const leastActiveUsersDlq = new Queue(stack, 'LeastActiveUsersDLQ');
    const leastFamousMoviesDlq = new Queue(stack, 'LeastFamousMoviesDLQ');

    const mostFamousMoviesQueue = new Queue(stack, 'MostFamousMoviesQueue', {
        cdk: {
            queue: {
                deadLetterQueue: {
                    maxReceiveCount: 3,
                    queue: mostFamousMoviesDlq.cdk.queue
                }
            }
        }
    });

    mostFamousMoviesQueue.addConsumer(stack, {
        function: {
            description: 'Most Famous Movies Handler',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.mostFamousMoviesHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: mostFamousMoviesDlq.cdk.queue,
            events: [
                new SqsEventSource(mostFamousMoviesQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const mostActiveUsersQueue = new Queue(stack, 'MostActiveUsersQueue', {
        cdk: {
            queue: {
                deadLetterQueue: {
                    maxReceiveCount: 3,
                    queue: mostActiveUsersDlq.cdk.queue
                }
            }
        }
    });

    mostActiveUsersQueue.addConsumer(stack, {
        function: {
            description: 'Most Active Users Handler',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.mostActiveUsersHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: mostActiveUsersDlq.cdk.queue,
            events: [
                new SqsEventSource(mostActiveUsersQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const mostTopRateMovieListQueue = new Queue(
        stack,
        'MostTopRateMovieListQueue',
        {
            cdk: {
                queue: {
                    deadLetterQueue: {
                        maxReceiveCount: 3,
                        queue: mostTopRateMovieListDlq.cdk.queue
                    }
                }
            }
        }
    );

    mostTopRateMovieListQueue.addConsumer(stack, {
        function: {
            description: 'Most Top Rate Movie List Handler',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.mostTopRateMovieListHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: mostTopRateMovieListDlq.cdk.queue,
            events: [
                new SqsEventSource(mostTopRateMovieListQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const mostFamousMoviesTopic = new Topic(stack, 'MostFamousMoviesTopic', {
        subscribers: {
            subscriber: {
                type: 'queue',
                queue: mostFamousMoviesQueue
            }
        }
    });

    const mostActiveUsersTopic = new Topic(stack, 'MostActiveUsersTopic', {
        subscribers: {
            subscriber: {
                type: 'queue',
                queue: mostActiveUsersQueue
            }
        }
    });
    const mostTopRateMovieListTopic = new Topic(
        stack,
        'MostTopRateMovieListTopic',
        {
            subscribers: {
                subscriber: {
                    type: 'queue',
                    queue: mostTopRateMovieListQueue
                }
            }
        }
    );

    const theBestAndFamousMoviesQueue = new Queue(
        stack,
        'TheBestAndFamousMoviesQueue',
        {
            cdk: {
                queue: {
                    deadLetterQueue: {
                        maxReceiveCount: 3,
                        queue: theBestAndFamousMoviesDlq.cdk.queue
                    }
                }
            }
        }
    );

    theBestAndFamousMoviesQueue.addConsumer(stack, {
        function: {
            description: 'The Best And Famous Movies',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.theBestAndFamousMoviesHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: theBestAndFamousMoviesDlq.cdk.queue,
            events: [
                new SqsEventSource(theBestAndFamousMoviesQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const theBestAndFamousMoviesTopic = new Topic(
        stack,
        'TheBestAndFamousMoviesTopic',
        {
            subscribers: {
                subscriber: {
                    type: 'queue',
                    queue: theBestAndFamousMoviesQueue
                }
            }
        }
    );

    const topRatedMoviesQueue = new Queue(stack, 'TopRatedMoviesQueue', {
        cdk: {
            queue: {
                deadLetterQueue: {
                    maxReceiveCount: 3,
                    queue: topRatedMoviesDlq.cdk.queue
                }
            }
        }
    });

    topRatedMoviesQueue.addConsumer(stack, {
        function: {
            description: 'Top Rated Movies',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.topRatedMoviesHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: topRatedMoviesDlq.cdk.queue,
            events: [
                new SqsEventSource(topRatedMoviesQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const topRatedMoviesTopic = new Topic(stack, 'TopRatedMoviesTopic', {
        subscribers: {
            subscriber: {
                type: 'queue',
                queue: topRatedMoviesQueue
            }
        }
    });

    const mostWorstRateMovieListQueue = new Queue(
        stack,
        'MostWorstRateMovieListQueue',
        {
            cdk: {
                queue: {
                    deadLetterQueue: {
                        maxReceiveCount: 3,
                        queue: mostWorstRateMovieListDlq.cdk.queue
                    }
                }
            }
        }
    );

    mostWorstRateMovieListQueue.addConsumer(stack, {
        function: {
            description: 'Most Worst Rate Movie List',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.mostWorstRateMovieListHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: mostWorstRateMovieListDlq.cdk.queue,
            events: [
                new SqsEventSource(mostWorstRateMovieListQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const mostWorstRateMovieListTopic = new Topic(
        stack,
        'MostWorstRateMovieListTopic',
        {
            subscribers: {
                subscriber: {
                    type: 'queue',
                    queue: mostWorstRateMovieListQueue
                }
            }
        }
    );

    const worstRatedMoviesQueue = new Queue(stack, 'WorstRatedMoviesQueue', {
        cdk: {
            queue: {
                deadLetterQueue: {
                    maxReceiveCount: 3,
                    queue: worstRatedMoviesDlq.cdk.queue
                }
            }
        }
    });

    worstRatedMoviesQueue.addConsumer(stack, {
        function: {
            description: 'Worst Rated Movies',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.worstRatedMoviesHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: worstRatedMoviesDlq.cdk.queue,
            events: [
                new SqsEventSource(worstRatedMoviesQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const worstRatedMoviesTopic = new Topic(stack, 'WorstRatedMoviesTopic', {
        subscribers: {
            subscriber: {
                type: 'queue',
                queue: worstRatedMoviesQueue
            }
        }
    });

    const leastActiveUsersQueue = new Queue(stack, 'LeastActiveUsersQueue', {
        cdk: {
            queue: {
                deadLetterQueue: {
                    maxReceiveCount: 3,
                    queue: leastActiveUsersDlq.cdk.queue
                }
            }
        }
    });

    leastActiveUsersQueue.addConsumer(stack, {
        function: {
            description: 'Least Active Users',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.leastActiveUsersHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: leastActiveUsersDlq.cdk.queue,
            events: [
                new SqsEventSource(leastActiveUsersQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const leastActiveUsersTopic = new Topic(stack, 'LeastActiveUsersTopic', {
        subscribers: {
            subscriber: {
                type: 'queue',
                queue: leastActiveUsersQueue
            }
        }
    });

    const leastFamousMoviesQueue = new Queue(stack, 'LeastFamousMoviesQueue', {
        cdk: {
            queue: {
                deadLetterQueue: {
                    maxReceiveCount: 3,
                    queue: leastFamousMoviesDlq.cdk.queue
                }
            }
        }
    });

    leastFamousMoviesQueue.addConsumer(stack, {
        function: {
            description: 'Least Famous Movies',
            handler:
                'packages/functions/src/fanoutSNS_SQS/queueHandlers.leastFamousMoviesHandler',
            timeout: 200,
            memorySize: 1536,
            deadLetterQueue: leastFamousMoviesDlq.cdk.queue,
            events: [
                new SqsEventSource(leastFamousMoviesQueue.cdk.queue, {
                    batchSize: 3
                })
            ]
        }
    });

    const leastFamousMoviesTopic = new Topic(stack, 'LeastFamousMoviesTopic', {
        subscribers: {
            subscriber: {
                type: 'queue',
                queue: leastFamousMoviesQueue
            }
        }
    });

    // Fanout with SNS
    const computeMetricsTopic = new Topic(stack, 'ComputeMetricsTopic', {
        defaults: {
            function: {
                memorySize: 1536,
                timeout: 200
            }
        }
    });

    const lambdaPublishingRole = new iam.Role(stack, 'LambdaPublishingRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                'service-role/AWSLambdaBasicExecutionRole'
            )
        ]
    });

    lambdaPublishingRole.addToPolicy(
        new iam.PolicyStatement({
            actions: ['sns:Publish'],
            resources: [
                computeMetricsTopic.topicArn,
                mostActiveUsersTopic.topicArn,
                mostFamousMoviesTopic.topicArn,
                mostTopRateMovieListTopic.topicArn,
                mostWorstRateMovieListTopic.topicArn,
                theBestAndFamousMoviesTopic.topicArn,
                topRatedMoviesTopic.topicArn,
                worstRatedMoviesTopic.topicArn,
                leastActiveUsersTopic.topicArn,
                leastFamousMoviesTopic.topicArn
            ]
        })
    );

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

    lambdaResourceManipulationRole.addToPolicy(
        new iam.PolicyStatement({
            actions: ['sns:Subscribe'],
            resources: [computeMetricsTopic.topicArn]
        })
    );

    const simpleComputing = new Function(stack, 'SimpleComputing', {
        handler: 'packages/functions/src/simpleComputing.main',
        role: lambdaResourceManipulationRole,
        timeout: 200,
        memorySize: 2048
    });

    const mostFamousMovies = new Function(stack, 'mostFamousMovies', {
        handler: 'packages/functions/src/mostFamousMovies.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const mostActiveUsers = new Function(stack, 'mostActiveUsers', {
        handler: 'packages/functions/src/mostActiveUsers.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const topRatedMovies = new Function(stack, 'topRatedMovies', {
        handler: 'packages/functions/src/topRatedMovies.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const worstRatedMovies = new Function(stack, 'worstRatedMovies', {
        handler: 'packages/functions/src/worstRatedMovies.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const theBestAndFamousMovies = new Function(
        stack,
        'theBestAndFamousMovies',
        {
            handler: 'packages/functions/src/theBestAndFamousMovies.handler',
            timeout: 200,
            role: lambdaResourceManipulationRole,
            memorySize: 2048
        }
    );

    const mostTopRateMovieList = new Function(stack, 'mostTopRateMovieList', {
        handler: 'packages/functions/src/mostTopRateMovieList.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const leastFamousMovies = new Function(stack, 'leastFamousMovies', {
        handler: 'packages/functions/src/leastFamousMovies.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const leastActiveUsers = new Function(stack, 'leastActiveUsers', {
        handler: 'packages/functions/src/leastActiveUsers.handler',
        timeout: 200,
        role: lambdaResourceManipulationRole,
        memorySize: 2048
    });

    const mostWorstRateMovieList = new Function(
        stack,
        'mostWorstRateMovieList',
        {
            handler: 'packages/functions/src/mostWorstRateMovieList.handler',
            timeout: 200,
            role: lambdaResourceManipulationRole,
            memorySize: 2048
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

    const fanoutWithSNS = new Function(stack, 'PublishMessageToStartCompute', {
        handler: 'packages/functions/src/publishMessageStartComputing.main',
        timeout: 10,
        memorySize: 128,
        role: lambdaPublishingRole
    });

    computeMetricsTopic.addSubscribers(stack, {
        mostFamousMovies: 'packages/functions/src/mostFamousMovies.handler',
        mostActiveUsers: 'packages/functions/src/mostActiveUsers.handler',
        topRatedMovies: 'packages/functions/src/topRatedMovies.handler',
        worstRatedMovies: 'packages/functions/src/worstRatedMovies.handler',
        theBestAndFamousMovies:
            'packages/functions/src/theBestAndFamousMovies.handler',
        mostTopRateMovieList:
            'packages/functions/src/mostTopRateMovieList.handler',
        leastFamousMovies: 'packages/functions/src/leastFamousMovies.handler',
        leastActiveUsers: 'packages/functions/src/leastActiveUsers.handler',
        mostWorstRateMovieList:
            'packages/functions/src/mostWorstRateMovieList.handler'
    });

    computeMetricsTopic.attachPermissionsToSubscriber('mostFamousMovies', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber('mostActiveUsers', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber('topRatedMovies', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber('worstRatedMovies', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber(
        'theBestAndFamousMovies',
        ['s3', 'dynamodb']
    );
    computeMetricsTopic.attachPermissionsToSubscriber('mostTopRateMovieList', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber('leastFamousMovies', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber('leastActiveUsers', [
        's3',
        'dynamodb'
    ]);
    computeMetricsTopic.attachPermissionsToSubscriber(
        'mostWorstRateMovieList',
        ['s3', 'dynamodb']
    );

    // Fanout SNS and SQS

    const fanoutSNSandSQS = new Function(stack, 'PublishMetricsToCompute', {
        handler:
            'packages/functions/src/fanoutSNS_SQS/publishMetricsToCompute.main',
        role: lambdaPublishingRole,
        memorySize: 256,
        timeout: 100
    });

    mostFamousMoviesTopic.attachPermissionsToSubscriber(
        'MostFamousMoviesQueue',
        ['s3', 'dynamodb']
    );

    mostActiveUsersTopic.attachPermissionsToSubscriber('MostActiveUsersQueue', [
        's3',
        'dynamodb'
    ]);

    mostTopRateMovieListTopic.attachPermissionsToSubscriber(
        'MostTopRateMovieListQueue',
        ['s3', 'dynamodb']
    );

    mostWorstRateMovieListTopic.attachPermissionsToSubscriber(
        'MostWorstRateMovieListQueue',
        ['s3', 'dynamodb']
    );

    theBestAndFamousMoviesTopic.attachPermissionsToSubscriber(
        'TheBestAndFamousMoviesQueue',
        ['s3', 'dynamodb']
    );

    topRatedMoviesTopic.attachPermissionsToSubscriber('TopRatedMoviesQueue', [
        's3',
        'dynamodb'
    ]);

    worstRatedMoviesTopic.attachPermissionsToSubscriber(
        'WorstRatedMoviesQueue',
        ['s3', 'dynamodb']
    );

    leastActiveUsersTopic.attachPermissionsToSubscriber(
        'LeastActiveUsersQueue',
        ['s3', 'dynamodb']
    );

    leastFamousMoviesTopic.attachPermissionsToSubscriber(
        'LeastFamousMoviesQueue',
        ['s3', 'dynamodb']
    );

    stack.addOutputs({
        Topic: computeMetricsTopic.topicName,
        Bucket: resourceBucket.bucketName,
        Table: table.tableName
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
        mostWorstRateMovieList,
        fanoutWithSNS,
        computeMetricsTopic,
        mostActiveUsersTopic,
        mostFamousMoviesTopic,
        mostTopRateMovieListTopic,
        mostWorstRateMovieListTopic,
        theBestAndFamousMoviesTopic,
        topRatedMoviesTopic,
        worstRatedMoviesTopic,
        leastActiveUsersTopic,
        leastFamousMoviesTopic,
        fanoutSNSandSQS
    };
}
