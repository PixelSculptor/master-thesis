import AWS from 'aws-sdk';

import { Config } from 'sst/node/config';

export async function putObjectToS3<T>(path: string, body: T) {
    const s3 = new AWS.S3();
    return new Promise(async (resolve, reject) => {
        try {
            const passedData = await s3
                .putObject({
                    Bucket: Config.AWS_S3_MOVIEDATASET_BUCKET,
                    Key: path,
                    Body: JSON.stringify(body)
                })
                .promise();
            if (!passedData) throw new Error('No data in file');
            resolve({ message: 'Successfully put object to S3' });
        } catch (error) {
            reject(error);
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
