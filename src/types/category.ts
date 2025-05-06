export interface Category {
  id: string;
  name: string;
  type: string;
  active: boolean;
  cost_center_id?: string;
  cost_center?: {
    id: string;
    name: string;
  };
}

export type CreateCategoryData = Omit<Category, 'id' | 'cost_center'>;
export type UpdateCategoryData = Omit<Category, 'cost_center'>;

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
  cost_center_id?: string;
  cost_center?: {
    id: string;
    name: string;
  };
}

export interface GetCategoriesResponse {
  categories: CategoryResponse[];
  total: number;
  page: number;
  items_per_page: number;
}
