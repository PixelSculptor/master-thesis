import { Api, StackContext, use, Config } from 'sst/constructs';
import { StorageStack } from './Storage.stack';

export function ApiStack({ stack }: StackContext) {
    const { table, resourceBucket, simpleComputing, basicFanout } =
        use(StorageStack);
    const S3_MOVIESET_BUCKET = new Config.Secret(
        stack,
        'AWS_S3_MOVIEDATASET_BUCKET'
    );
    const DYNAMODB_FINISH_EXECUTION_TABLE = new Config.Secret(
        stack,
        'AWS_DYNAMODB_FINISH_EXECUTION'
    );

    const api = new Api(stack, 'ServerlessComputingApi', {
        defaults: {
            function: {
                bind: [
                    table,
                    resourceBucket,
                    simpleComputing,
                    basicFanout,
                    S3_MOVIESET_BUCKET,
                    DYNAMODB_FINISH_EXECUTION_TABLE
                ]
            }
        },
        routes: {
            'GET /simpleComputing':
                'packages/functions/src/simpleComputing.main',
            'GET /fanoutEntry': 'packages/functions/src/fanoutEntry.main'
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    };
}
