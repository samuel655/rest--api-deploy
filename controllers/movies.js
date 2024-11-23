// import { MovieModel } from '../models/local-file-system/movie.js'
import { validateMovie, validatePartialMovie } from '../schema/movie-schema.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => { 
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
  
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
  
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newMovie = await this.movieModel.create({ input: result.data })

    // fs.writeFile('./data/movies.json', JSON.stringify(movies, null, 2))
    res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)
    const { id } = req.params
    
    if (!result.success) 
      return res.status(400).json({ error: JSON.parse(result.error.message) })
  
    const updateMovie = await this.movieModel.update({ id, input: result.data })
    // fs.writeFile('./data/movies.json', JSON.stringify(movies, null, 2))
    
    res.json(updateMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })
    
    if (!result) return res.status(404).json({ message: 'Not found Movie' })
    // fs.writeFile('./data/movies.json', JSON.stringify(movies, null, 2))
    return res.json({ message: 'Movie deleted' })
  }
}