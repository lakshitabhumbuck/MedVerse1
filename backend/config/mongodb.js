

import mongoose from 'mongoose'

const connetDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected!'))
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err))
    mongoose.connection.on('disconnected', () => console.log('Database Disconnected!'))

    let mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    console.log('Attempting to connect to MongoDB...')
    console.log('MongoDB URI format check:', mongoURI.startsWith('mongodb://') || mongoURI.startsWith('mongodb+srv://') ? 'Valid' : 'Invalid')

    await mongoose.connect(mongoURI)
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    console.error('Please check your MONGODB_URI environment variable')
    process.exit(1)
  }
}

export default connetDB
