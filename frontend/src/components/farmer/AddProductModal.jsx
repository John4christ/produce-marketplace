import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    unit: "",
    quantity_available: "",
    status: "active",
  });
useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/categories`
            );

            setCategories(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Unable to load categories");
        }
    };

    fetchCategories();
      

}, []);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("agri_auth_token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added successfully");

      onSuccess();

      onClose();

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Unable to add product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">

        <h2>Add Produce</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />

          <select
    name="category_id"
    value={form.category_id}
    onChange={handleChange}
>
    <option value="">Select Category</option>

    {categories.map((category) => (
        <option key={category.id} value={category.id}>
            {category.name}
        </option>
    ))}
</select>

          <input
            name="price"
            placeholder="Price"
            onChange={handleChange}
          />

          <input
            name="unit"
            placeholder="Unit"
            onChange={handleChange}
          />

          <input
            name="quantity_available"
            placeholder="Quantity"
            onChange={handleChange}
          />

          <button type="submit">
            Save Product
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>

        </form>

      </div>
    </div>
  );
};

export default AddProductModal;
