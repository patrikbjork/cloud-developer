import {DocumentClient} from "aws-sdk/clients/dynamodb";

export function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new DocumentClient({
            region: 'eu-north-1',
            endpoint: 'http://localhost:8000'
        })
    }

    return new DocumentClient()
}
