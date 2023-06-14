import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../helpers/todos'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  // TODO: Implement creating a new TODO item
  const todo = await createTodo(userId, newTodo)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: todo
    })
  }
}
