import { SSTConfig } from 'sst';
import { StorageStack } from './stacks/Storage.stack';

export default {
    config(_input) {
        return {
            name: 'serverless-design-patterns',
            region: 'eu-central-1'
        };
    },
    stacks(app) {
        app.stack(StorageStack);
    }
} satisfies SSTConfig;
