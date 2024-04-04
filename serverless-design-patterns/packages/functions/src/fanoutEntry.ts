import handler from '@serverless-design-patterns/core/handler';

export const main = handler(async (event) => {
    return JSON.stringify({ message: 'Hello from fanoutEntry' });
});
