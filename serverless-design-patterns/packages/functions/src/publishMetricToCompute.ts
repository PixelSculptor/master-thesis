import { Config } from 'sst/node/config';
import SNS, { PublishInput } from 'aws-sdk/clients/sns';

import apiHandler from '@serverless-design-patterns/core/apiHandler';
import { fileNames } from 'src/utils/putObjectToS3';

const topics = [
    Config.AWS_SNS_MostFamousMovies_TOPIC,
    Config.AWS_SNS_MostActiveUsers_TOPIC,
    Config.AWS_SNS_TopRatedMovies_TOPIC,
    Config.AWS_SNS_WorstRatedMovies_TOPIC,
    Config.AWS_SNS_TheBestAndFamousMovies_TOPIC,
    Config.AWS_SNS_MostTopRateMovieList_TOPIC,
    Config.AWS_SNS_LeastFamousMovies_TOPIC,
    Config.AWS_SNS_LeastActiveUsers_TOPIC,
    Config.AWS_SNS_MostWorstRateMovieList_TOPIC
];

const sns = new SNS();

export const main = apiHandler(async (event) => {
    if (Config.AWS_S3_MOVIEDATASET_BUCKET === undefined) {
        return JSON.stringify({
            message: 'Error: AWS_S3_MOVIEDATASET_BUCKET is not defined'
        });
    }

    const numOfTry = event.queryStringParameters?.numOfTry ?? '1';

    const moviePromises = topics.map(async (topic) => {
        return fileNames.map(async (fileName) => {
            const params: PublishInput = {
                TopicArn: topic,
                Message: JSON.stringify({
                    fileName,
                    numOfTry
                })
            };
            await sns.publish(params).promise();
        });
    });
    try {
        await Promise.all(moviePromises.flat());
        return JSON.stringify({ message: 'Message was published' });
    } catch (error) {
        return JSON.stringify({ message: 'Error in publishing message' });
    }
});
