import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import commentRoutes from './routes/comment.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cookieParser from 'cookie-parser'


dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then( () => {
    console.log('MongoDB is connected')
}).catch(err => {
    console.log(err)
})

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/category', categoryRoutes)


//middleware for handling error
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})