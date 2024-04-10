import workerHandler from '../../core/src/workerHandler';
import { mostActiveUsers } from '@serverless-design-patterns/core/index';

export const handler = workerHandler(mostActiveUsers, 'mostActiveUsers');
