import { api } from "@/api";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  GetCategoriesParams,
  GetCategoriesResponse,
} from "@/types/category";

export const fetchCategory = async (categoryId: string): Promise<Category> => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
};

export const fetchCategories = async (
  params: GetCategoriesParams
): Promise<GetCategoriesResponse> => {
  const response = await api.get("/categories", { params });
  return response.data;
};

export const createCategory = async (
  newCategory: CreateCategoryData
): Promise<Category> => {
  const response = await api.post("/categories", newCategory);
  return response.data;
};

export const updateCategory = async (
  updatedCategory: UpdateCategoryData
): Promise<Category> => {
  const response = await api.put(
    `/categories/${updatedCategory.id}`,
    updatedCategory
  );
  return response.data;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await api.delete(`/categories/${categoryId}`);
};
