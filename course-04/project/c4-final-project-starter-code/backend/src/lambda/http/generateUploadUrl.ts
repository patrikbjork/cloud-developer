import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {S3} from "../../s3/s3";
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const s3 = new S3()

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const signedUrl = s3.getSignedPutUrl(todoId);
    logger.info('Generated signed put url: ' + signedUrl)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({uploadUrl: signedUrl})
    }
}
