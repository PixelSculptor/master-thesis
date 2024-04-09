import { Api, StackContext, use } from 'sst/constructs';
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
        mostWorstRateMovieList
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
                    mostActiveUsers,
                    topRatedMovies,
                    worstRatedMovies,
                    theBestAndFamousMovies,
                    mostTopRateMovieList,
                    leastFamousMovies,
                    leastActiveUsers,
                    mostWorstRateMovieList
                ]
            }
        },
        routes: {
            'GET /simpleComputing':
                'packages/functions/src/simpleComputing.main',
            'GET /fanoutBasic': 'packages/functions/src/fanoutEntry.main'
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    };
}
