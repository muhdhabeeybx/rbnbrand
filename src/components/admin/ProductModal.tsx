import React, { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  useAdmin,
  AdminProduct,
} from "../../contexts/AdminContext";
import { toast } from "sonner@2.0.3";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: AdminProduct;
  mode: "add" | "edit";
}

const CATEGORIES = [
  { value: "hoodies", label: "Hoodies" },
  { value: "tees", label: "T-Shirts" },
  { value: "outerwear", label: "Outerwear" },
  { value: "pants", label: "Pants" },
  { value: "accessories", label: "Accessories" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  "Black",
  "White",
  "Grey",
  "Navy",
  "Olive",
  "Khaki",
  "Indigo",
  "Stone Wash",
];

export function ProductModal({
  isOpen,
  onClose,
  product,
  mode,
}: ProductModalProps) {
  const { addProduct, updateProduct } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
    status: "active" as "active" | "inactive" | "draft",
    sizes: [] as string[],
    colors: [] as string[],
  });

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        description: product.description,
        image: product.image,
        status: product.status,
        sizes: product.sizes,
        colors: product.colors,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
        status: "active",
        sizes: [],
        colors: [],
      });
    }
  }, [product, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        description: formData.description,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
        status: formData.status,
        sizes: formData.sizes,
        colors: formData.colors,
      };

      if (mode === "add") {
        addProduct(productData);
        toast.success("Product added successfully!");
      } else if (product) {
        updateProduct(product.id, productData);
        toast.success("Product updated successfully!");
      }

      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add New Product"
              : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock: e.target.value,
                  }))
                }
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter product description"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Product Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">
                  Inactive
                </SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Available Sizes *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SIZES.map((size) => (
                <div
                  key={size}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`size-${size}`}
                    checked={formData.sizes.includes(size)}
                    onCheckedChange={() =>
                      handleSizeToggle(size)
                    }
                  />
                  <label
                    htmlFor={`size-${size}`}
                    className="text-sm font-medium"
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Available Colors *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COLORS.map((color) => (
                <div
                  key={color}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`color-${color}`}
                    checked={formData.colors.includes(color)}
                    onCheckedChange={() =>
                      handleColorToggle(color)
                    }
                  />
                  <label
                    htmlFor={`color-${color}`}
                    className="text-sm font-medium"
                  >
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {mode === "add"
                ? "Add Product"
                : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}