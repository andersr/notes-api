import uuid from 'uuid';
// import AWS from 'aws-sdk';
import { success, failure } from './libs/response-lib';
import * as dynamoDbLib from './libs/dynamodb-lib';
// maybe need AWS.config.update({ region: "my-region" });
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context) {
    const data = JSON.parse(event.body); // HTTP request params

    const params = {
        TableName: process.env.tableName, // where being set?
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId, // set after user has been authenticated
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now(),
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
    } catch (error) {
        console.log('error: ', error);
        return failure({ status: false });
    }
}