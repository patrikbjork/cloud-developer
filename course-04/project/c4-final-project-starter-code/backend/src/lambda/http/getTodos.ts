import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId} from "../utils";
import {DbAccess} from "../../dynamodb/dbAccess";
import {S3} from "../../s3/s3";
import {TodoItem} from "../../models/TodoItem";
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')
const dbAccess = new DbAccess()
const s3 = new S3()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user


    const userId = getUserId(event)

    const todos = await dbAccess.getTodos(userId).promise();

    logger.info('Fetched todos. Size=' + todos.Items.length)

    const promises = [];
    todos.Items.forEach((item: TodoItem) => {
        const promise = s3.getSignedGetUrlIfExists(item.todoId)
        promise.then(value => item.attachmentUrl = value)
        promises.push(promise);
    })

    await Promise.all(promises)

    let compatibilityResult = todos as any;
    compatibilityResult.items = todos.Items;
    // TODO: Implement creating a new TODO item
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(compatibilityResult)
    }
}
