import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './Storage.stack';

export function ApiStack({ stack }: StackContext) {
    const { table } = use(StorageStack);

    const api = new Api(stack, 'ServerlessComputingApi', {
        defaults: {
            function: {
                bind: [table]
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
