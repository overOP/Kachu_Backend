import Category from "../database/models/category.model";

export const getAllCategoriesService = async () => {
  return Category.findAll();
};

export const getCategoryByIdService = async (id: number) => {
  return Category.findByPk(id);
};

export const createCategoryService = async (categoryName: string) => {
  return Category.create({ categoryName });
};

export const updateCategoryService = async (
  id: number,
  categoryName: string
) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("CATEGORY_NOT_FOUND");

  category.categoryName = categoryName;
  await category.save();
  return category;
};

export const deleteCategoryService = async (id: number) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("CATEGORY_NOT_FOUND");

  await category.destroy();
  return category;
};