import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import { connect } from './utils/db'
import config from './config'
import { notFound, handleError } from './middleware/handle.error'
import UserRouter from './resources/user/user.router'
import ProductRouter from './resources/product/product.router'
import auth from './utils/auth'

export const app = express()
app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/api/auth', auth.authenticate, auth.login)
app.use('/api/user', UserRouter)
app.use('/api/product', ProductRouter)

app.use(handleError)
app.use(notFound)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    // console.log(e)
  }
}
