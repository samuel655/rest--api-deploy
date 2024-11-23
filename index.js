import express from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import { MovieModel } from './models/mysql/movie.js'

export const createApp = ({ movieModel }) => {
  const port = process.env.PORT ?? 1234
  
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())
  app.use(corsMiddleware())
  
  app.use('/movies', createMovieRouter({ movieModel }))
  
  app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
  })
  
  app.listen(port, () => {
    console.log(`server listening on port http://localhost:${port}`)
  })
}

