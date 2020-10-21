import { Response } from 'express'
import { ResponseInterface } from '../entities/interfaces/data/response.interface'
import errorHandler from './errors.handler'
import parseResponse from './response.parser'

const responseSender = async (data: ResponseInterface, res: Response): Promise<void> => {
  res = await errorHandler.response(data, res)
  res.send(data)
}

const responseHandler = async (next: Function, res: Response): Promise<void> => {
  try {
    const data: ResponseInterface = await next()
    responseSender(parseResponse(data), res)
  } catch (error) {
    responseSender(parseResponse(error), res)
  }
}

export default responseHandler
