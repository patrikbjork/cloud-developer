import * as DynamoDB from "aws-sdk/clients/dynamodb";
import * as AWSXRay from "aws-xray-sdk"

export function createDynamoDBClient(): DynamoDB.DocumentClient {
    let documentClient: DynamoDB.DocumentClient
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        documentClient = new DynamoDB.DocumentClient({
            region: 'eu-north-1',
            endpoint: 'http://localhost:8000'
        })
    } else {
        documentClient = new DynamoDB.DocumentClient()
        AWSXRay.captureAWSClient((documentClient as any).service)
    }

    return documentClient
}
