import handler from '../../core/src/handler';

export const main = handler(async (event) => {
    // Get Data from S3 in loop
    // For each file in the bucket perform set of tasks
    // After computing data on each file count up counter in DynamoDB
    return JSON.stringify({ message: 'Hello from simple computing!' });
});
