import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const bucketName = process.env.ATTACHMENTS_S3_BUCKET;

// TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todoTableGsi = process.env.TODOS_TABLE_GSI ) {
            AWSXRay.captureAWSClient((docClient as any).service)
    }

    async getItems(userId: string) : Promise<TodoItem[]>{
        const result =  await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoTableGsi,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        return result.Items as TodoItem[];
    }

    async createItem(userId: string, newTodo: CreateTodoRequest) : Promise<TodoItem>{
        
        const todoId = uuid.v4();

        const item : TodoItem = {
            name: newTodo.name,
            dueDate: newTodo.dueDate,
            userId: userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            done: false
        }

        await this.docClient.put({
            TableName: this.todoTable,
            Item: item
        }).promise();
        return item;
    }

    async deleteItem(todoId: string) : Promise<void>{
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            }
        }).promise();
    }

    async updateItem(todoId: string, updatedTodo: UpdateTodoRequest) : Promise<TodoUpdate>{
        const newTodo : TodoUpdate = {
            done: updatedTodo.done,
            dueDate: updatedTodo.dueDate,
            name: updatedTodo.name
        }
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            },
            UpdateExpression: "set #todoName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            ExpressionAttributeValues: {
                ":name": newTodo.name,
                ":done": newTodo.done,
                ":dueDate": newTodo.dueDate
            }
        }).promise();
        return newTodo;
    }

    async updateTodoAttachmentUrl(todoId: string, attachmentId: string) : Promise<void>{
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
            }
        }).promise();
    }
}