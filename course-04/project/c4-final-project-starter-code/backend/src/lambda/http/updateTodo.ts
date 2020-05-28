import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {getUserId} from "../utils";
import {DbAccess} from "../../dynamodb/dbAccess";
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')
const dbAccess = new DbAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const userId = getUserId(event)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await dbAccess.updateTodo(updatedTodo, todoId, userId).promise();

    logger.info('Updated TODO: ' + todoId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    };
}
