import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'

import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {createDynamoDBClient} from "../../dynamodb/dynamoDbClient";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const docClient: DocumentClient = createDynamoDBClient()
    const todosTable = process.env.TODOS_TABLE

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await docClient.update({
        TableName: todosTable,
        UpdateExpression: 'SET #name1=:name1, dueDate=:dueDate, done=:done',
        ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
            '#name1': 'name'
        },
        ExpressionAttributeValues: {
            ":name1": updatedTodo.name,
            ":dueDate": updatedTodo.dueDate,
            ":done": updatedTodo.done
        },
        Key: {todoId: todoId}
    }).promise();

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    };
}


/*function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new DocumentClient()
}*/

