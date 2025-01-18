import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createCategory, deleteCategory, getCategory } from '../controllers/category.controller.js'

const router = express.Router()

router.post('/create', verifyToken, createCategory)

router.get('/getcategory', verifyToken, getCategory)

router.delete('/deleteCategory/:categoryId', verifyToken, deleteCategory);


export default router