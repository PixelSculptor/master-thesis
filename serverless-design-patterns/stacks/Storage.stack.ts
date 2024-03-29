import { Bucket, StackContext, Table } from 'sst/constructs';

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

    return {
        table,
        resourceBucket
    };
}
