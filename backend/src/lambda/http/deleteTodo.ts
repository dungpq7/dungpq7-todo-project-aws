import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { deleteTodo } from '../../helpers/todos'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  // TODO: Remove a TODO item by id
  await deleteTodo(todoId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      succeed: true
    })
  }
}
