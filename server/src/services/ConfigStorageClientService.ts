import * as AWS from 'aws-sdk';

class ConfigStorageClientService {
    public upload: (key: string, body: Buffer | string) => void;

    constructor() {
        if (
            process.env.JFC_S3_ACCESS_KEY_ID &&
            process.env.JFC_S3_SECRET_ACCESS_KEY &&
            process.env.JFC_S3_REGION &&
            process.env.JFC_S3_CONFIG_STORAGE_BUCKET_NAME
        ) {
            AWS.config.update({
                credentials: {
                    accessKeyId: process.env.JFC_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.JFC_S3_SECRET_ACCESS_KEY
                },
                region: process.env.JFC_S3_REGION
            });

            this.upload = this.S3UploadImpl.bind(this, new AWS.S3());
        } else {
            this.upload = this.dummyUploadImpl;
        }
    }

    protected S3UploadImpl(
        s3Client: AWS.S3,
        key: string,
        body: Buffer | string
    ): void {
        s3Client.upload(
            {
                Bucket: process.env.JFC_S3_CONFIG_STORAGE_BUCKET_NAME,
                Key: key,
                Body: body
            },
            this.S3UploadCallback
        );
    }

    protected S3UploadCallback(err: Error): void {
        err && console.error(err);
    }

    protected dummyUploadImpl(): void {
        return;
    }
}

export { ConfigStorageClientService };
