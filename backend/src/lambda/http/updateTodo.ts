import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const result = await updateTodo(todoId, updatedTodo)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: result
    })
  }
}
