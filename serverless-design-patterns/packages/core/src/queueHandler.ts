import { Handler, SQSEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import { MovieType } from '../../types/MovieType';
import { MessageBodyType } from '../../types/MessageType';
import { Config } from 'sst/node/config';
import { putObjectToS3 } from '../../functions/src/utils/putObjectToS3';
import { addComputeLogToDB } from '../../functions/src/utils/addComputeLogToDB';

export type MetricName =
    | 'mostFamousMovies'
    | 'mostActiveUsers'
    | 'topRatedMovies'
    | 'worstRatedMovies'
    | 'theBestAndFamousMovies'
    | 'mostTopRateMovieList'
    | 'leastFamousMovies'
    | 'leastActiveUsers'
    | 'mostWorstRateMovieList';

const s3 = new S3();

export default function queueHandler<T>(
    metricWorker: (movieSet: MovieType[]) => T,
    movieMetric: MetricName
): Handler {
    return async (event: SQSEvent) => {
        const moviePromises = event.Records.map(async (message) => {
            try {
                const messageBody: MessageBodyType = JSON.parse(message.body);
                const data = await s3
                    .getObject({
                        Bucket: Config.AWS_S3_MOVIEDATASET_BUCKET,
                        Key: `${messageBody.fileName}.json`
                    })
                    .promise();

                if (data.Body === undefined) throw new Error('No data in file');

                const movies: MovieType[] = JSON.parse(data.Body.toString());

                const computedMetric = metricWorker(movies);

                const response = await putObjectToS3(
                    `metrics/'fanoutWithSNSandSQSPattern'/${messageBody.fileName}/${movieMetric}.json`,
                    computedMetric
                );

                if (response.code === 400 && response.error) {
                    throw new Error(response.error);
                }
                await addComputeLogToDB(
                    'fanoutWithSNSandSQSPattern',
                    messageBody.numOfTry,
                    `${messageBody.fileName}/${movieMetric}`
                );
            } catch (error) {
                console.error('Erorr in processing message: ', error);
            }
        });

        try {
            await Promise.all(moviePromises);
            console.log('Successfully processed all messages');
        } catch (error) {
            console.error('Error processing messages: ', error);
        }
    };
}
