import mongoose from 'mongoose'


const postShema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        unique: true
    },

    category:{
        type: String,
        default: 'uncategorized'
    },

    slug:{
        type: String,
        required: true,
        unique: true
    },

    content:{
        type: String,
        required: true
    },

    userId:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default: 'https://www.dreamhost.com/blog/wp-content/uploads/2022/10/Navigation-Menu-Design-Tips-Feature-750x498.jpg'
    },

}, {timestamps: true} )


const Post = mongoose.model('Post', postShema)

export default Post