import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { TodoUpdate } from '../models/TodoUpdate'
import * as uuid from 'uuid'
// TODO: Implement businessLogic
const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('TodosAccess')

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Fetching all todos for userId', { userId: userId })
  const result = await todoAccess.getItems(userId)
  logger.info('Fetching complete.', result)
  return result as TodoItem[]
}

export async function createTodo(
  userId: string,
  newTodo: CreateTodoRequest
): Promise<TodoItem> {
  logger.info('Creating new todo object.')
  try {
    var result = await todoAccess.createItem(userId, newTodo)
    logger.info('Create complete.')
    return result
  } catch (error) {
    logger.error('Create failed.')
  }
}

export async function updateTodo(
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<TodoUpdate> {
  logger.info('Updating todo:', {
    todoId: todoId,
    updatedTodo: updatedTodo
  })
  try {
    var result = await todoAccess.updateItem(todoId, updatedTodo)
    logger.info('Update complete.')
    return result
  } catch (error) {
    logger.error('Update failed.')
  }
}

export async function deleteTodo(todoId: string): Promise<void> {
  logger.info('Deleting todo:', { todoId: todoId })
  try {
    todoAccess.deleteItem(todoId)
    logger.info('Delete complete.', { todoId: todoId })   
  } catch (error) {
    logger.error('Delete failed.')
  }
}

export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<string> {
  try {
    const attachmentId = uuid.v4()
    const uploadUrl = attachmentUtils.getPutSignedUrl(attachmentId);
    logger.info(`Updating todoId ${todoId}`)
    await todoAccess.updateTodoAttachmentUrl(todoId, attachmentId)
    logger.info('Update complete.')
    return uploadUrl
  } catch (error) {
    logger.error(`Update failed. ${error.message}`)
  }
}
