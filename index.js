import express from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const port = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(corsMiddleware())

app.use('/movies', moviesRouter)

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (acceptedOrigins.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
//   }
//   res.send(200)
// })

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
