export interface Category {
  id: string;
  name: string;
  type: string;
  active: boolean;
}

export type CreateCategoryData = Omit<Category, 'id'>;
export type UpdateCategoryData = Category;

export interface GetCategoriesParams {
  search?: string;
  page?: number;
  items_per_page?: number;
  sort_by?: string[];
  sort_order?: Array<'asc' | 'desc'>;
}

export interface CategoryResponse {
  id: string;
  name: string;
  type: string;
}

export interface GetCategoriesResponse {
  categories: CategoryResponse[];
  total: number;
  page: number;
  items_per_page: number;
}
