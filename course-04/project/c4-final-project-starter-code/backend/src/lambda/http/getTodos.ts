import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createDynamoDBClient} from "../../dynamodb/dynamoDbClient";
import {TodoItem} from "../../models/TodoItem";
import * as s3 from "aws-sdk/clients/s3";
import {getUserId} from "../utils";

const bucket = process.env.IMAGES_S3_BUCKET;
const sThree = new s3();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    const todosTable = process.env.TODOS_TABLE
    const todosTableIndex = process.env.INDEX_NAME

    const userId = getUserId(event)

    const documentClient = createDynamoDBClient();

    const todos = await documentClient.query({
        TableName: todosTable,
        IndexName: todosTableIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {':userId': userId}
    }).promise();

    const promises = [];
    todos.Items.forEach((item: TodoItem) => {
        const promise = sThree.getObject({Bucket: bucket, Key: item.todoId}).promise().then(_ => {
            item.attachmentUrl = sThree.getSignedUrl('getObject', {Bucket: bucket, Key: item.todoId})
        }).catch(_ => {});
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
