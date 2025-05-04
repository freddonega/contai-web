import { api } from "@/api";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  GetCategoriesParams,
  GetCategoriesResponse,
} from "@/types/category";

export const fetchCategory = async (categoryId: string): Promise<Category> => {
  try {
    const response = await api.get(`/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const fetchCategories = async (
  params: GetCategoriesParams
): Promise<GetCategoriesResponse> => {
  try {
    const response = await api.get("/category", { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (
  newCategory: CreateCategoryData
): Promise<Category> => {
  try {
    const response = await api.post("/category", newCategory);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (
  updatedCategory: UpdateCategoryData
): Promise<Category> => {
  try {
    const response = await api.put(
      `/category/${updatedCategory.id}`,
      updatedCategory
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await api.delete(`/category/${categoryId}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
