import * as _s3 from "aws-sdk/clients/s3";

export class S3 {
    bucket = process.env.IMAGES_S3_BUCKET;
    s3 = new _s3()

    public getSignedPutUrl(todoId) {
        return this.s3.getSignedUrl('putObject', {Bucket: this.bucket, Key: todoId});
    }

    public getSignedGetUrlIfExists(todoId): Promise<string> {
        return this.s3.getObject({Bucket: this.bucket, Key: todoId}).promise().then(_ => {
            return this.s3.getSignedUrlPromise('getObject', {Bucket: this.bucket, Key: todoId})
        }).catch(_ => null)
    }
}
