import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    // console.log(req.body)

    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save();

        res.json("Signup successfull")
    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are requierd'))
    }

    try {

        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password)

        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'))
        }

        //create token for sign-in
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        //remove the password from the valid user
        const { password: pass, ...rest } = validUser._doc;

        //add token to the cookie
        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest)


    } catch (error) {
        next(error)
    }
}