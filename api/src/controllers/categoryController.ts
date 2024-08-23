import Category from "../models/categoryModel";
import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, subcategories } = req.body;
    const category = new Category({
      name,
      description,
      subcategories,
    });
    await category.save();
    res.status(StatusCodes.CREATED).json({ success: true, data: category });
  } catch (error: Error | any) {
    return next(error);
  }
};

export const getAllCategories = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: categories, count: categories.length });
  } catch (error: Error | any) {
    return next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFound("Category not found");
    }
    res.status(StatusCodes.OK).json({ success: true, data: category });
  } catch (error: Error | any) {
    return next(error);
  }
};

export const getCategoriesByTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { topic } = req.params;
  try {
    if (!topic) {
      throw new NotFound("Topic not found");
    }
    const category = await Category.find({
      topic: new RegExp(`^${topic}$`, "i"),
    });
    if (!category.length || category.length === 0) {
      throw new NotFound("There are no categories for this topic");
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: category, count: category.length });
  } catch (error: Error | any) {
    return next(error);
  }
};

export const updateCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, subcategories } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, subcategories },
      { new: true, runValidators: true }
    );
    if (!category) {
      throw new NotFound("Category not found");
    }
    res.status(StatusCodes.OK).json({ success: true, data: category });
  } catch (error: Error | any) {
    return next(error);
  }
};

export const deleteCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new NotFound("Category not found");
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: `Category has been successfully deleted` });
  } catch (error: Error | any) {
    return next(error);
  }
};
