import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { resizeImage } from "../../utils/resizeImage";
import { apiClient } from "../../services/api";

const AddProductModal = ({ isOpen, onClose, onSuccess, editProduct = null }) => {
  const isEdit = !!editProduct;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    unit: "kg",
    quantity_available: "",
    status: "published",
    tags: "",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await apiClient.get('/categories', {
            params: { per_page: 100 },
          });

          const categoriesData = response?.data || response || [];
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || []);
        } catch {
          toast.error("Unable to load categories");
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && editProduct) {
      setForm({
        name: editProduct.name || "",
        description: editProduct.description || "",
        category_id: editProduct.category?.id || editProduct.category_id || "",
        price: editProduct.price || "",
        unit: editProduct.unit || "kg",
        quantity_available: editProduct.quantity_available || "",
        status: editProduct.status || "published",
        tags: Array.isArray(editProduct.tags) ? editProduct.tags.join(", ") : "",
      });
      const primaryImage = editProduct.images?.find(img => img.sort_order === 1) || editProduct.images?.[0];
      setImagePreview(primaryImage?.url || null);
    } else if (isOpen) {
      setForm({
        name: "",
        description: "",
        category_id: "",
        price: "",
        unit: "kg",
        quantity_available: "",
        status: "published",
        tags: "",
      });
      setImagePreview(null);
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen, editProduct]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      try {
        const resized = await resizeImage(file, 800, 0.8);
        setImageFile(resized.file);
        setImagePreview(resized.preview);
      } catch (err) {
        toast.error("Failed to process image. Please try another file.");
      }
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required.";
    if (!form.category_id) newErrors.category_id = "Please select a category.";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter a valid price.";
    if (!form.unit.trim()) newErrors.unit = "Unit is required.";
    if (!form.quantity_available || Number(form.quantity_available) < 0) newErrors.quantity_available = "Enter a valid quantity.";
    if (!["draft", "published", "archived"].includes(form.status)) newErrors.status = "Invalid status.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = isEdit ? `/products/${editProduct.id}` : "/products";
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category_id", form.category_id);
      formData.append("price", form.price);
      formData.append("unit", form.unit);
      formData.append("quantity_available", form.quantity_available);
      formData.append("status", form.status);
      if (form.tags.trim()) {
        form.tags.split(",").forEach((tag) => formData.append("tags[]", tag.trim()));
      }
      if (imageFile) {
        formData.append("images[]", imageFile);
      }

      const response = isEdit
        ? await apiClient.put(url, formData)
        : await apiClient.post(url, formData);

      toast.success(isEdit ? "Product updated successfully" : "Product added successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Unable to save product.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Edit Produce" : "Add New Produce"}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Organic Tomatoes"
              required
            />

            <div className="form-group">
              <label className="input-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your produce..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className={errors.category_id ? "input-error" : ""}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <span className="input-error-msg">{errors.category_id}</span>}
            </div>

            <Input
              label="Price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              error={errors.price}
              placeholder="0.00"
              required
            />

            <Input
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              error={errors.unit}
              placeholder="kg, lb, bunch..."
              required
            />

            <Input
              label="Quantity Available"
              name="quantity_available"
              type="number"
              min="0"
              value={form.quantity_available}
              onChange={handleChange}
              error={errors.quantity_available}
              placeholder="0"
              required
            />

            <div className="form-group">
              <label className="input-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="organic, local, seasonal"
              />
            </div>

            <div className="form-group">
              <label className="input-label">
                {isEdit ? "Replace Image (optional)" : "Product Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {errors.image && <span className="input-error-msg">{errors.image}</span>}
              {imagePreview && (
                <div className="image-preview">
                  <img key={imagePreview} src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              {isEdit ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
