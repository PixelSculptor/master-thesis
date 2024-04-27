import AWS from 'aws-sdk';
import { Config } from 'sst/node/config';

type PutObjectToS3Response = {
    code: 201 | 400;
    error?: string;
    message: string;
};

export async function putObjectToS3<T>(
    path: string,
    body: T
): Promise<PutObjectToS3Response> {
    const s3 = new AWS.S3();
    return new Promise(async (resolve, reject) => {
        try {
            const passedData = await s3
                .putObject({
                    Bucket: Config.AWS_S3_MOVIEDATASET_BUCKET as string,
                    Key: path,
                    Body: JSON.stringify(body)
                })
                .promise();
            if (!passedData.ETag) throw new Error('No data in file');
            resolve({ code: 201, message: 'Successfully put object to S3' });
        } catch (error) {
            const errorResponse = {
                code: 400,
                message: 'Error putting object to S3',
                error:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error)
            };
            reject(errorResponse);
        }
    });
}

export const fileNames = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J'
] as const;

export const metricNames = [
    'mostFamousMovies',
    'mostActiveUsers',
    'topRatedMovies',
    'worstRatedMovies',
    'theBestAndFamousMovies',
    'mostTopRateMovieList',
    'leastFamousMovies',
    'leastActiveUsers',
    'mostWorstRateMovieList'
] as const;
