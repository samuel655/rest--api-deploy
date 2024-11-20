import express from 'express'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './schema/movie-schema.js'

const port = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const acceptedOrigins = [
      'http://127.0.0.1:3000'
    ]

    if (acceptedOrigins.includes(origin) || !origin) {
      return callback(null, true)
    }
  }
}))

app.get('/movies', (req, res) => {
  const { genre } = req.query

  fs.readFile('data/movies.json', 'utf-8')
    .then(data => {
      if (genre) {
        const filteredMovies = JSON.parse(data).filter(
          movie => movie.genre.some(
            g => g.toLowerCase() === genre.toLowerCase()
          )
        )
        return res.json(filteredMovies)
      }

      res.json(JSON.parse(data))
    })
})

app.get('/movies2', (req, res) => {
  const { genre } = req.query

  fs.readFile('/data/movies.json', 'utf-8')
    .then(data => {
      if (genre) {
        const filteredMovies = JSON.parse(data).filter(
          movie => movie.genre.some(
            g => g.toLowerCase() === genre.toLowerCase()
          )
        )
        return res.json(filteredMovies)
      }

      res.json(JSON.parse(data))
    })
})

app.get('/movies3', (req, res) => {
  const { genre } = req.query

  fs.readFile('~/data/movies.json', 'utf-8')
    .then(data => {
      if (genre) {
        const filteredMovies = JSON.parse(data).filter(
          movie => movie.genre.some(
            g => g.toLowerCase() === genre.toLowerCase()
          )
        )
        return res.json(filteredMovies)
      }

      res.json(JSON.parse(data))
    })
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  fs.readFile('./movies.json', 'utf-8')
    .then(data => {
      const movie = JSON.parse(data).find(movie => movie.id === id)

      if (movie) return res.json(movie)
      res.status(404).json({ message: 'Movie not found' })
    })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

  const newMovie = { id: crypto.randomUUID(), ...result.data }

  fs.readFile('./movies.json', 'utf-8')
    .then(data => {
      const movies = JSON.parse(data)
      movies.push(newMovie)

      fs.writeFile('./movies.json', JSON.stringify(movies, null, 2))

      res.status(201).json(newMovie)
    })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  fs.readFile('./movies.json', 'utf-8')
    .then(data => {
      const movies = JSON.parse(data)
      const movieIndex = movies.findIndex(movie => movie.id === id)

      if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
      }

      const updateMovie = { ...movies[movieIndex], ...result.data }

      movies[movieIndex] = updateMovie
      fs.writeFile('./movies.json', JSON.stringify(movies, null, 2))

      res.json(updateMovie)
    })
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params

  fs.readFile('./movies.json', 'utf-8')
    .then(data => {
      const movies = JSON.parse(data)
      const movieIndex = movies.findIndex(movie => movie.id === id)

      if (movieIndex === -1) return res.status(404).json({ message: 'Not found Movie' })

      movies.splice(movieIndex, 1)
      fs.writeFile('./movies.json', JSON.stringify(movies, null, 2))
      return res.json({ message: 'Movie deleted' })
    })
})

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
