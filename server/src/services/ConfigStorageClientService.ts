import * as AWS from 'aws-sdk';

class ConfigStorageClientService {
    public upload: (key: string, body: Buffer | string) => Promise<void>;

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
    ): Promise<void> {
        return new Promise(
            this.S3UploadExecutor.bind(this, s3Client, key, body)
        );
    }

    protected S3UploadExecutor(
        s3Client: AWS.S3,
        key: string,
        body: Buffer | string,
        resolve: () => void,
        reject: (err: any) => void
    ): void {
        s3Client.upload(
            {
                Bucket: process.env.JFC_S3_CONFIG_STORAGE_BUCKET_NAME,
                Key: key,
                Body: body
            },
            this.S3UploadCallback.bind(this, resolve, reject)
        );
    }

    protected S3UploadCallback(
        resolve: () => void,
        reject: (err: any) => void,
        err: Error,
        data: AWS.S3.ManagedUpload.SendData
    ): void {
        if (data) {
            resolve();
        } else {
            reject(err);
        }
    }

    protected async dummyUploadImpl(): Promise<void> {
        return;
    }
}

export { ConfigStorageClientService };
