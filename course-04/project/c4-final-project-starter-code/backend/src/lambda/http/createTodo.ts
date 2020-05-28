import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import {TodoItem} from "../../models/TodoItem";
import {getUserId} from "../utils";
import {DbAccess} from "../../dynamodb/dbAccess";

const dbAccess = new DbAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    const newTodo: TodoItem = {
        todoId: uuid.v4(),
        done: false,
        userId: userId,
        createdAt: new Date().toISOString(),
        ...createTodoRequest
    };
    console.log('newTodo: ' + newTodo)

    await dbAccess.createTodo(newTodo).promise();
    // TODO: Implement creating a new TODO item

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({item: newTodo})
    }
}
