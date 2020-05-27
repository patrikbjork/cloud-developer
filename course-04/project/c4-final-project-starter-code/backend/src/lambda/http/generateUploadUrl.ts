import 'source-map-support/register'
import * as s3 from 'aws-sdk/clients/s3'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'

const bucket = process.env.IMAGES_S3_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const signedUrl = new s3().getSignedUrl('putObject', {Bucket: bucket, Key: todoId});

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({uploadUrl: signedUrl})
    }
}
