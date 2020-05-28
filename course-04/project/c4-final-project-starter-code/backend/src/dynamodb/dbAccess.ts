import {createDynamoDBClient} from "./dynamoDbClient";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoItem} from "../models/TodoItem";

export class DbAccess {

    todosTable = process.env.TODOS_TABLE
    todosTableIndex = process.env.INDEX_NAME
    documentClient = createDynamoDBClient();

    public getTodos(userId: string) {
        return this.documentClient.query({
            TableName: this.todosTable,
            IndexName: this.todosTableIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {':userId': userId}
        });
    }

    public createTodo(item: TodoItem) {
        return this.documentClient.put({
            TableName: this.todosTable,
            Item: {
                todoId: item.todoId,
                createdAt: item.createdAt,
                userId: item.userId,
                done: item.done,
                dueDate: item.dueDate,
                name: item.name,
            }
        })
    }

    public deleteTodo(todoId, userId) {
        return this.documentClient.delete({
            TableName: this.todosTable,
            Key: {todoId: todoId, userId: userId},
            ReturnItemCollectionMetrics: "SIZE",
            ReturnValues: "ALL_OLD"
        })
    }

    public updateTodo(updatedTodo: UpdateTodoRequest, todoId, userId) {
/*
        const params: DynamoDB.Types.UpdateItemInput = {
            TableName: this.todosTable,
            UpdateExpression: 'SET #name1=:name1, dueDate=:dueDate, done=:done',
            ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                '#name1': 'name'
            },
            ExpressionAttributeValues: {
                ":name1": {"S": updatedTodo.name},
                ":dueDate": {"S": updatedTodo.dueDate},
                ":done": {"B": updatedTodo.done}
            },
            Key: {todoId: {"S": todoId}, userId: {"S": userId}}
        };
*/
        return this.documentClient.update({
            TableName: this.todosTable,
            UpdateExpression: 'SET #name1=:name1, dueDate=:dueDate, done=:done',
            ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                '#name1': 'name'
            },
            ExpressionAttributeValues: {
                ":name1": updatedTodo.name,
                ":dueDate": updatedTodo.dueDate,
                ":done": updatedTodo.done
            },
            /*ExpressionAttributeValues: {
                ":name1": {"S": updatedTodo.name},
                ":dueDate": {"S": updatedTodo.dueDate},
                ":done": {"B": updatedTodo.done}
            },*/
            Key: {todoId: todoId, userId: userId}
        })
    }
}
