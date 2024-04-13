import workerHandler from '@serverless-design-patterns/core/workerHandler';
import { leastActiveUsers } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(leastActiveUsers, 'leastActiveUsers');
