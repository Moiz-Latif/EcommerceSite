import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  CategoryId: string;
  CategoryName: string;
  Description: string;
  Image: string;
}

interface CategoryCardProps {
  category: Category;
  onRemove: (id: string) => void;
}

const CategoryCard = ({ category, onRemove }: CategoryCardProps) => (
  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 relative">
    <h3 className="text-lg font-bold text-gray-800 mb-2">{category.CategoryName}</h3>
    <p>{category.Description}</p>
    <img src={category.Image} alt="Category" className="mt-2 rounded-md" />
    <button
      onClick={() => onRemove(category.CategoryId)}
      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition duration-300"
    >
      Remove
    </button>
  </div>
);

export default function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>(""); // For category name
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>(""); // For description
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/AdminDashboard/GetCategory`);
        if (response?.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError("Failed to fetch category details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryDescription.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("CategoryName", newCategoryName);
    formData.append("Description", newCategoryDescription);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(`http://localhost:3000/AdminDashboard/AddCategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data) {
        setCategories((prevCategories) => [...prevCategories, response.data]);
        setNewCategoryName("");
        setNewCategoryDescription("");
        setPreviewImages([]);
        setImages([]);
        toast.success("Category added successfully!");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.post(`http://localhost:3000/AdminDashboard/DeleteCategory/${categoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.CategoryId !== categoryId)
      );
      toast.success("Category removed successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
      setImages(files);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-2xl text-gray-600 pl-52 pt-20">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen px-8 font-roboto pl-56 pt-20">
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate mb-6">Categories</h2>

      {/* Add Category Input */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add a New Category</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <textarea
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            rows={4}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add
          </button>
        </div>
        <div className="flex gap-4 mt-4">
          {previewImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index}`}
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Categories Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.CategoryId} category={category} onRemove={handleRemoveCategory} />
        ))}
      </div>
    </div>
  );
}
