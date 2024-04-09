import AWS from 'aws-sdk';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function updateCounterTable(
    patternName: string
): Promise<AWS.DynamoDB.UpdateItemOutput> {
    return new Promise(async (resolve, reject) => {
        try {
            const updateItemParams: AWS.DynamoDB.DocumentClient.UpdateItemInput =
                {
                    TableName: process.env
                        .AWS_DYNAMODB_FINISH_EXECUTION as string,
                    Key: {
                        patternName: patternName
                    },
                    ExpressionAttributeNames: {
                        '#C': 'counter',
                        '#T': 'timestamp'
                    },
                    ExpressionAttributeValues: {
                        ':inc': 1,
                        ':now': moment().format('YYYY-MM-DD HH:mm:ss')
                    },
                    UpdateExpression: 'ADD #C :inc SET #T = :now',
                    ReturnValues: 'UPDATED_NEW'
                };
            const data = await dynamoDb.update(updateItemParams).promise();
            if (data.Attributes === undefined)
                throw new Error('No data in file');
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}
