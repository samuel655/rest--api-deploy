import cors from 'cors'

export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
      const acceptedOrigins = [
        'http://localhost:3000'
      ]
  
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by cors'))
    }
  })