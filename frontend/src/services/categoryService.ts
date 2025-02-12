import categoryApi from "./api/categoryApi";

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentCategory?: number | null;
}

class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    const response = await categoryApi.get("/list/");
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await categoryApi.get(`/detail/${id}`);
    return response.data;
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const response = await categoryApi.post("/", category);
    return response.data;
  }

  async updateCategory(
    id: number,
    category: Partial<Category>
  ): Promise<Category> {
    const response = await categoryApi.put(`/detail/${id}`, category);
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await categoryApi.delete(`/detail/${id}`);
  }

  async createBulkCategories(
    categories: Omit<Category, "id">[]
  ): Promise<Category[]> {
    const response = await categoryApi.post("/bulk", { categories });
    return response.data;
  }
}

export default new CategoryService();
