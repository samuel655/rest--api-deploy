import { createApp } from './index.js'
import { MovieModel } from './models/mysql/movie.js'

createApp({ movieModel: MovieModel })