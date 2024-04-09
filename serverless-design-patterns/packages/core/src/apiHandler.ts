import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export default function apiHandler(
    lambda: (evt: APIGatewayProxyEvent, ctx: Context) => Promise<string>
) {
    return async function (event: APIGatewayProxyEvent, context: Context) {
        let body, statusCode;

        try {
            body = await lambda(event, context);
            statusCode = 200;
        } catch (error) {
            body = JSON.stringify({
                error: error instanceof Error ? error.message : error
            });
        }
        return {
            statusCode,
            body
        };
    };
}
