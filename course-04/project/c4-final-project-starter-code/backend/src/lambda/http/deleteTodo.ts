import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createDynamoDBClient} from "../../dynamodb/dynamoDbClient";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const todosTable = process.env.TODOS_TABLE

  const documentClient = createDynamoDBClient();

  await documentClient.delete({
    TableName: todosTable,
    Key: {todoId: todoId},
    ReturnItemCollectionMetrics: "SIZE",
    ReturnValues: "ALL_OLD"
  }).promise();
  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
