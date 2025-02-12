// Job model based on backend structure
export interface Job {
  id: number;
  companyId: number;
  description: string;
  locationId: number;
  status: string;
  salaryRange: string;
  createdAt: string;
  updatedAt: string | null;
  title: string;
  postDate: string;
  requirements: Array<{
    description: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    parentCategory: string | null;
  }>;
}
