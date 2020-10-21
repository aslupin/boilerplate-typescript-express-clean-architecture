import App from './app'

import express from 'express'
import loggerMiddleware from './middlewares/logger.middleware'
import TodoRoutes from './routes/todo.route'

const app = new App({
  routes: [new TodoRoutes()],
  middleWares: {
    before: [
      express.json(),
      express.urlencoded({ extended: true }),
      loggerMiddleware,
    ],
    after: [],
  },
})

app.listen()
