import { S3 } from 'aws-sdk';
import handler from '../../core/src/handler';
import { MovieType } from '../../types/MovieType';
import { mostFamousMovies } from '../../core/src/computing/popularityOfMovies';
const s3 = new S3();

export const main = handler(async (event) => {
    // Get Data from S3 in loop
    // For each file in the bucket perform set of tasks
    // After computing data on each file count up counter in DynamoDB
    const fileNames = ['A'] as const;
    const bucketName =
        'kacper-serverless-design--moviedatasetbuckete8282f-s4k9patlpqo6';

    try {
        const data = await s3
            .getObject({
                Bucket: bucketName,
                Key: `data/${fileNames[0]}.json`
            })
            .promise();
        if (data.Body === undefined) throw new Error('No data in file');
        const movies: MovieType[] = JSON.parse(data.Body.toString());
        const mostFamousMetric = mostFamousMovies(movies);
        console.log(mostFamousMetric[0]);
    } catch (error) {
        if (error instanceof Error) console.log(error.message);
    }

    return JSON.stringify({ message: 'Hello from simple computing!' });
});
