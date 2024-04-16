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
        computeMetricsTopic
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

    const AWS_SNS_TOPIC = new Config.Parameter(stack, 'AWS_SNS_TOPIC', {
        value: computeMetricsTopic.topicArn
    });

    computeMetricsTopic.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostFamousMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostActiveUsers.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    topRatedMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    worstRatedMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    theBestAndFamousMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    mostTopRateMovieList.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    leastFamousMovies.bind([AWS_BUCKET, DYNAMODB_TABLE]);
    leastActiveUsers.bind([AWS_BUCKET, DYNAMODB_TABLE]);

    const api = new Api(stack, 'ServerlessComputingApi', {
        defaults: {
            function: {
                memorySize: 1024,
                timeout: 200,
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
                    AWS_BUCKET,
                    DYNAMODB_TABLE,
                    COMPUTING_LAMBDA_NAMES,
                    AWS_SNS_TOPIC
                ]
            }
        },
        routes: {
            'GET /simpleComputing':
                'packages/functions/src/simpleComputing.main',
            'GET /fanoutBasic': 'packages/functions/src/fanoutEntry.main',
            'GET /fanoutWithSNS':
                'packages/functions/src/publishMessageStartComputing.main'
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    };
}
