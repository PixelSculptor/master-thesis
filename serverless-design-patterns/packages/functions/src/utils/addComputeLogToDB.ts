import AWS from 'aws-sdk';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
const docClient = new AWS.DynamoDB.DocumentClient();

export async function addComputeLogToDB(
    patternName: string,
    numberOfTry: string,
    metricName = ''
): Promise<AWS.DynamoDB.PutItemOutput> {
    return new Promise(async (resolve, reject) => {
        try {
            const putItemParams: AWS.DynamoDB.DocumentClient.Put = {
                TableName: process.env.AWS_DYNAMODB_FINISH_EXECUTION as string,
                Item: {
                    patternName: patternName,
                    numberOfTry: numberOfTry,
                    metricName: metricName,
                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss:SSS')
                }
            };
            const response = await docClient.put(putItemParams).promise();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}
