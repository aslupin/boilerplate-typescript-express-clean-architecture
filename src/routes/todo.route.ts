import express from 'express'
import { Request, Response } from 'express'
import TodoUsecase from '../usecase/todo.usecase'
import responseHandler from '../helper/response.handler'
import { createDTO, updateDTO } from '../entities/dtos/todo.dto'
import * as Validator from '../helper/validate.helper'

class TodoRoutes {
  public prefix_route = '/todo'
  public router = express.Router()

  constructor() {
    this.routes()
  }

  routes() {
    
    this.router.get(`${this.prefix_route}/findall`, this.findAll)
    this.router.post(`${this.prefix_route}/create`, this.create)
    this.router.put(`${this.prefix_route}/update`, this.update)
    this.router.delete(`${this.prefix_route}/delete`, this.delete)
  }

  findAll = async (req: Request, res: Response) => {
    responseHandler(async () => {
      const data = await TodoUsecase.findAllTodo()
      return data
    }, res)
  }

  create = async (req: Request, res: Response): Promise<void> => {
    responseHandler(async () => {
      const reqCreate: createDTO = req.body
      const { task_name, task_content } = reqCreate
      console.log(reqCreate)
      if (!Validator.validCheckInput(task_name, task_content)) {
        throw new Error(`400 : Invalid input, Please input field task_name and task_content`)
      }
      
      const data = await TodoUsecase.createTodo(reqCreate)
      return data
    }, res)
  }

  update = async (req: Request, res: Response): Promise<void> => {
    responseHandler(async () => {
      const reqUpdate: updateDTO = req.body
      const { _id, ...rawUpdate } = reqUpdate

      if (!Validator.validCheckID(_id)) {
        throw new Error(`400 : Invalid input, Please input field id`)
      }

      const errorFieldsUpdate = Validator.validUpdatedFields(rawUpdate)
      if (errorFieldsUpdate.length > 0) {
        throw new Error(`400 : Invalid Fields! ${errorFieldsUpdate.join(', ')}`)
      }

      const data = await TodoUsecase.updateTodo(reqUpdate)
      return data
    }, res)
  }

  delete = async (req: Request, res: Response) => {
    responseHandler(async () => {
      const data = await TodoUsecase.deleteTodo(req.body)
      return data
    }, res)
  }
}

export default TodoRoutes
