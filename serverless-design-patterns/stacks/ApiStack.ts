import { Api, Config, StackContext, use } from 'sst/constructs';
import { StorageStack } from './Storage.stack';

export function ApiStack({ stack }: StackContext) {
    const {
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
        fanoutSNSandSQS,
        mostActiveUsersTopic,
        mostFamousMoviesTopic,
        topRatedMoviesTopic,
        worstRatedMoviesTopic,
        theBestAndFamousMoviesTopic,
        mostTopRateMovieListTopic,
        leastFamousMoviesTopic,
        leastActiveUsersTopic,
        mostWorstRateMovieListTopic,
        messagingPatternQueue,
        publishMetricsMessagesLambda
    } = use(StorageStack);

    const AWS_BUCKET = new Config.Parameter(
        stack,
        'AWS_S3_MOVIEDATASET_BUCKET',
        {
            value: resourceBucket.bucketName
        }
    );

    const DYNAMODB_TABLE = new Config.Parameter(
        stack,
        'AWS_DYNAMODB_FINISH_EXECUTION',
        {
            value: table.tableName
        }
    );

    const COMPUTING_LAMBDA_NAMES = new Config.Parameter(
        stack,
        'COMPUTING_LAMBDA_NAMES',
        {
            value: `${mostFamousMovies.functionName},${mostActiveUsers.functionName},${topRatedMovies.functionName},${worstRatedMovies.functionName},${theBestAndFamousMovies.functionName},${mostTopRateMovieList.functionName},${leastFamousMovies.functionName},${leastActiveUsers.functionName},${mostWorstRateMovieList.functionName}`
        }
    );

    // bind this to compute fanoutBasic COMPUTING_LAMBDA_NAMES,

    const AWS_SNS_TOPIC = new Config.Parameter(stack, 'AWS_SNS_TOPIC', {
        value: computeMetricsTopic.topicArn
    });

    const AWS_SNS_MostFamousMovies_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_MostFamous_TOPIC',
        {
            value: mostFamousMoviesTopic.topicArn
        }
    );

    const AWS_SNS_MostActive_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_MostActive_TOPIC',
        {
            value: mostActiveUsersTopic.topicArn
        }
    );

    const AWS_SNS_TopRated_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_TopRated_TOPIC',
        {
            value: topRatedMoviesTopic.topicArn
        }
    );

    const AWS_SNS_WorstRated_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_WorstRated_TOPIC',
        {
            value: worstRatedMoviesTopic.topicArn
        }
    );

    const AWS_SNS_BestFamous_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_BestFamous_TOPIC',
        {
            value: theBestAndFamousMoviesTopic.topicArn
        }
    );

    const AWS_SNS_MostTopRated_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_MostTopRated_TOPIC',
        {
            value: mostTopRateMovieListTopic.topicArn
        }
    );

    const AWS_SNS_LeastFamous_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_LeastFamous_TOPIC',
        {
            value: leastFamousMoviesTopic.topicArn
        }
    );

    const AWS_SNS_LeastActive_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_LeastActive_TOPIC',
        {
            value: leastActiveUsersTopic.topicArn
        }
    );

    const AWS_SNS_MostWorstRated_TOPIC = new Config.Parameter(
        stack,
        'AWS_SNS_MostWorstRated_TOPIC',
        {
            value: mostWorstRateMovieListTopic.topicArn
        }
    );

    const AWS_SQS_METRICS_QUEUE_URL = new Config.Parameter(
        stack,
        'AWS_SQS_METRICS_QUEUE_URL',
        {
            value: messagingPatternQueue.queueUrl
        }
    );

    computeMetricsTopic.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostFamousMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostActiveUsers.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    topRatedMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    worstRatedMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    theBestAndFamousMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostTopRateMovieList.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    leastFamousMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    leastActiveUsers.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostWorstRateMovieList.bind([AWS_BUCKET, DYNAMODB_TABLE]);

    messagingPatternQueue.bind([AWS_BUCKET, DYNAMODB_TABLE]);

    fanoutWithSNS.bind([AWS_BUCKET, DYNAMODB_TABLE]);

    const api = new Api(stack, 'ServerlessComputingApi', {
        defaults: {
            function: {
                memorySize: 256,
                timeout: 100,
                bind: [
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
                    fanoutSNSandSQS,
                    messagingPatternQueue,
                    publishMetricsMessagesLambda,
                    AWS_BUCKET,
                    DYNAMODB_TABLE,
                    AWS_SNS_TOPIC,
                    AWS_SNS_MostFamousMovies_TOPIC,
                    AWS_SNS_MostActive_TOPIC,
                    AWS_SNS_TopRated_TOPIC,
                    AWS_SNS_WorstRated_TOPIC,
                    AWS_SNS_BestFamous_TOPIC,
                    AWS_SNS_MostTopRated_TOPIC,
                    AWS_SNS_LeastFamous_TOPIC,
                    AWS_SNS_LeastActive_TOPIC,
                    AWS_SNS_MostWorstRated_TOPIC,
                    AWS_SQS_METRICS_QUEUE_URL
                ]
            }
        },
        routes: {
            'GET /simpleComputing':
                'packages/functions/src/simpleComputing.main',
            'GET /fanoutBasic': 'packages/functions/src/fanoutEntry.main',
            'GET /fanoutWithSNS':
                'packages/functions/src/publishMessageStartComputing.main',
            'GET /fanoutSNSandSQS':
                'packages/functions/src/publishMetricToCompute.main',
            'GET /messagingPattern':
                'packages/functions/src/publishMetricsToQueue.main'
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    };
}
