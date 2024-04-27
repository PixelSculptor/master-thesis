import { SQSEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { Config } from 'sst/node/config';

import * as metrics from '@serverless-design-patterns/core/index';
import { MessageMetricType } from '../../types/MessageType';
import { MovieType } from '../../types/MovieType';
import { putObjectToS3 } from './utils/putObjectToS3';
import { addComputeLogToDB } from './utils/addComputeLogToDB';

const s3 = new S3();

export const main = async (event: SQSEvent) => {
    try {
        const metricsToCompute = event.Records.map(async (message) => {
            let result = null;
            const messageBody = JSON.parse(message.body);
            if (!isSQSMessage(messageBody)) {
                throw new Error('Invalid message');
            }

            const data = await s3
                .getObject({
                    Bucket: Config.AWS_S3_MOVIEDATASET_BUCKET,
                    Key: `${messageBody.nameOfFile}.json`
                })
                .promise();

            if (data.Body === undefined) throw new Error('No data in file');

            const movieSet: MovieType[] = JSON.parse(data.Body.toString());

            switch (messageBody.metricName) {
                case 'mostFamousMovies':
                    result = metrics.mostFamousMovies(movieSet);
                    break;

                case 'mostActiveUsers':
                    result = metrics.mostActiveUsers(movieSet);
                    break;

                case 'topRatedMovies':
                    result = metrics.topRatedMovies(movieSet);
                    break;

                case 'worstRatedMovies':
                    result = metrics.worstRatedMovies(movieSet);
                    break;

                case 'theBestAndFamousMovies':
                    result = metrics.theBestAndFamousMovies(movieSet);
                    break;

                case 'mostTopRateMovieList':
                    result = metrics.mostTopRateMovieList(movieSet);
                    break;

                case 'leastFamousMovies':
                    result = metrics.leastFamousMovies(movieSet);
                    break;

                case 'leastActiveUsers':
                    result = metrics.leastActiveUsers(movieSet);
                    break;

                case 'mostWorstRateMovieList':
                    result = metrics.mostWorstRateMovieList(movieSet);
                    break;

                default:
                    throw new Error('Invalid metric');
            }

            const response = await putObjectToS3(
                `metrics/messagingPattern/${messageBody.nameOfFile}/${messageBody.metricName}.json`,
                result
            );
            if (response.code === 400 && response.error) {
                throw new Error(response.error);
            }
            await addComputeLogToDB(
                'messagingPattern',
                messageBody.numOfTry,
                `${messageBody.nameOfFile}/${messageBody.metricName}`
            );
        });

        await Promise.all(metricsToCompute);
    } catch (error) {
        console.error('Error in processing message: ', error);
    }
};

const isSQSMessage = (payload: unknown): payload is MessageMetricType => {
    if (typeof payload !== 'object' || payload === null) return false;
    return (
        (payload as MessageMetricType).metricName !== undefined &&
        (payload as MessageMetricType).nameOfFile !== undefined &&
        (payload as MessageMetricType).numOfTry !== undefined
    );
};
