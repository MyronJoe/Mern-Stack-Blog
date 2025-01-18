import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";

export const createCategory = async (req, res, next) => {

    const { categoryName } = req.body;

    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }

    if (!req.body.categoryName) {
        return next(errorHandler(400, 'Please provide the required field'))
    }

    try {

        const validateCategory = await Category.findOne({ categoryName });

        if (validateCategory) {
            return next(errorHandler(409, 'Category alredy exist'))
        }

        // console.log(validateCategory, categoryName)

        const newCategory = new Category({
            categoryName,
        });

        await newCategory.save();

        res.status(200).json(newCategory);


    } catch (error) {
        next(error)
    }
}

export const getCategory = async (req, res, next) => {

    if (!req.user.isAdmin)
        return next(errorHandler(403, 'You are not allowed to get all Categories'));
    try {

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        const categories = await Category.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        res.status(200).json({ categories });

    } catch (error) {
        next(error);
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return next(errorHandler(404, 'Category not found'));
        }

        if (!req.user.isAdmin) {
            return next(
                errorHandler(403, 'You are not allowed to delete this category')
            );
        }

        await Category.findByIdAndDelete(req.params.categoryId);

        res.status(200).json('Category has been deleted');

    } catch (error) {
        next(error);
    }
};