import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then( () => {
    console.log('MongoDB is connected')
}).catch(err => {
    console.log(err)
})

const app = express();



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

app.use('/api/user', userRoutes)