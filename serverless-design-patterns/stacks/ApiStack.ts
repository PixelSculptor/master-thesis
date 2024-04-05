import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './Storage.stack';

export function ApiStack({ stack }: StackContext) {
    const {
        table,
        resourceBucket,
        simpleComputing,
        basicFanout,
        mostFamousMovies
    } = use(StorageStack);

    const api = new Api(stack, 'ServerlessComputingApi', {
        defaults: {
            function: {
                bind: [
                    table,
                    resourceBucket,
                    simpleComputing,
                    basicFanout,
                    mostFamousMovies,
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
