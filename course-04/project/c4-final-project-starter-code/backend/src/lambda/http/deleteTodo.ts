import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId} from "../utils";
import {DbAccess} from "../../dynamodb/dbAccess";
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')
const dbAccess = new DbAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const userId = getUserId(event)

  await dbAccess.deleteTodo(todoId, userId).promise();
  // TODO: Implement creating a new TODO item

  logger.info('Deleted TODO: ' + todoId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
