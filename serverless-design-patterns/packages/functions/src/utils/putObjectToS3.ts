import AWS from 'aws-sdk';

import { Config } from 'sst/node/config';

export async function putObjectToS3<T>(path: string, body: T) {
    const s3 = new AWS.S3();
    return new Promise(async (resolve, reject) => {
        try {
            const passedData = s3
                .putObject({
                    Bucket: Config.AWS_S3_MOVIEDATASET_BUCKET,
                    Key: path,
                    Body: JSON.stringify(body)
                })
                .promise();
            if (!passedData) throw new Error('No data in file');
            resolve(passedData);
        } catch (error) {
            reject(error);
        }
    });
}
