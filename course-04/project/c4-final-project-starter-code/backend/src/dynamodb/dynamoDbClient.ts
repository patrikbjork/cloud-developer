import {DocumentClient} from "aws-sdk/clients/dynamodb";

export function createDynamoDBClient() {
    console.log('process.env.IS_OFFLINE: ' + process.env.IS_OFFLINE)
    console.log('process.env: ' + process.env)
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new DocumentClient({
            region: 'eu-north-1',
            endpoint: 'http://localhost:8000'
        })
    }

    return new DocumentClient()
}
