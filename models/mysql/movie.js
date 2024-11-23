import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre }) {

    if (genre) {
        const [movie] = await connection.query(
          `
            SELECT BIN_TO_UUID(M.id) id, M.title, M.year, M.director, M.duration, M.poster, M.rate 
            FROM movie M 
            INNER JOIN movie_genres MG on MG.movie_id = M.id 
            INNER JOIN genre G on MG.genre_id = G.id 
            WHERE LOWER(G.name) like ?;
          `, [genre.toLowerCase()]
        )
        return movie
    }

    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie'
    )
    return movies
  }

  static async getById({ id }) {
    let [movie] = await connection.query(
      `
        SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate 
        FROM movie
        WHERE UUID_TO_BIN(?) = id;
      `,[id]
    )

    const [genre] = await connection.query(
      `
        SELECT G.name
        FROM genre G
        INNER JOIN movie_genres MG ON MG.genre_id = G.id
        INNER JOIN movie M ON M.id = MG.movie_id 
        WHERE UUID_TO_BIN(?) = M.id;
      `,[id]
    )

    movie[0]['genre'] = genre.map(g => g.name)
    return movie
  }

  static async create({ input }) {
    const {
      genre, title, year, duration, director, rate, poster 
    } = input
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    
    try {
      await connection.query(
        `
          INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN('${uuid}'), ?, ?, ?, ?, ?, ?);
        `, [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      throw new Error('Error creating movie ')
    }
    
    try {
        const [genres] = await connection.query(`SELECT * FROM genre`)
        let query = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES'
        genres.map(g => {
            if (genre.map(v => v.toLowerCase()).includes(g.name.toLowerCase())) {
                query += `\n(UUID_TO_BIN('${uuid}'), ${g.id}),`
            }
        })
        
        query = query.slice(0, -1) + ';'
        await connection.query(query)
    } catch (e) {
        throw new Error('Error creating foreign')
    }

    let [movie] = await connection.query(
      `
        SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate 
        FROM movie
        WHERE UUID_TO_BIN(?) = id;
      `,[uuid]
    )

    const [gen] = await connection.query(
        `
          SELECT G.name
          FROM genre G
          INNER JOIN movie_genres MG ON MG.genre_id = G.id
          INNER JOIN movie M ON M.id = MG.movie_id 
          WHERE UUID_TO_BIN(?) = M.id;
        `,[uuid]
      )
  
      movie[0]['genre'] = gen.map(g => g.name)
    return movie
  }

  static async update({ id, input }) {

  }

  static async delete({ id }) {

  }
}