import React, { useState } from "react";

import { toast } from "react-toastify";

import useAxios from "../hooks/useAxios";

import { useNavigate } from "react-router-dom";

interface CategoryFormData {
  name: string;

  parentCategory: string | null;
}

const CategoryForm: React.FC = () => {
  const api = useAxios();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",

    parentCategory: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,

        parentCategory: formData.parentCategory || null,
      };
      const response = await api.post("/categories", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Category added successfully!");

        setFormData({ name: "", parentCategory: null });

        navigate("/categories");
      }
    } catch (error) {
      console.error("Error adding category:", error);

      toast.error(
        "Failed to add category. Please check the form and try again."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Add New Category
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="parentCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Parent Category
              </label>

              <input
                type="text"
                id="parentCategory"
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
