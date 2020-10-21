import express from 'express'
import config from './config/config'
import { Application } from 'express'
import MongoAdapter from './adapters/mongo.adapter'
import RabbitMQAdapter from './adapters/rabbitmq.adapter'

class App {
  public app: Application
  public portApp: number = parseInt(`${config.app.port}`, 10) ?? 8080

  private databaseInfo = {
    username: config.db.mongo.username!,
    password: config.db.mongo.password!,
    host: config.db.mongo.host!,
    port: parseInt(`${config.db.mongo.port}`, 10) ?? 27017,
    dbName: config.db.mongo.name!,
    authName: config.db.mongo.auth!,
  }

  private queueInfo = {
    username: config.queue.connection.username!,
    password: config.queue.connection.password!,
    host: config.queue.connection.host!,
    port: parseInt(`${config.queue.connection.port}`, 10) ?? 5672,
  }

  constructor(appInit: { middleWares: { before: any; after: any }; routes: any }) {
    this.app = express()
    // this.connectQueue()
    this.connectDatabase()
    this.middlewares(appInit.middleWares.before)
    this.routes(appInit.routes)
    // this.middlewares(appInit.middleWares.after)
  }

  private async connectDatabase() {
    let { username, password, host, port, dbName, authName } = this.databaseInfo
    await new MongoAdapter(username, password, host, port, dbName, authName)
  }

  private async connectQueue() {
    await RabbitMQAdapter.getInstance(this.queueInfo)
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare)
    })
  }

  public routes(routes: { forEach: (arg0: (routes: any) => void) => void }) {
    this.app.get('/healthcheck', (req, res) => res.send('service is alive.'))
    routes.forEach((route) => {
      this.app.use('/', route.router)
    })
  }

  public listen() {
    this.app.listen(this.portApp, () => {
      console.log(`App listening on the http://localhost:${this.portApp}`)
    })
  }
}

export default App
