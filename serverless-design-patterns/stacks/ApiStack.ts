import { Api, StackContext, use, Config } from 'sst/constructs';
import { StorageStack } from './Storage.stack';

export function ApiStack({ stack }: StackContext) {
    const { table, resourceBucket, simpleComputing } = use(StorageStack);
    const S3_MOVIESET_BUCKET = new Config.Secret(
        stack,
        'AWS_S3_MOVIEDATASET_BUCKET'
    );

    const api = new Api(stack, 'ServerlessComputingApi', {
        defaults: {
            function: {
                bind: [table, resourceBucket, simpleComputing, S3_MOVIESET_BUCKET]
            }
        },
        routes: {
            'GET /simpleComputing':
                'packages/functions/src/simpleComputing.main'
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    };
}
