import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Loader2,
  ImageIcon,
  Check,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
} from "../../contexts/AdminContextFixed";
import { toast } from "sonner@2.0.3";

const CATEGORIES = [
  { value: "hoodies", label: "Hoodies" },
  { value: "tees", label: "T-Shirts" },
  { value: "outerwear", label: "Outerwear" },
  { value: "pants", label: "Pants" },
  { value: "accessories", label: "Accessories" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size Fits All"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Olive", hex: "#65a30d" },
  { name: "Khaki", hex: "#a3a08a" },
  { name: "Indigo", hex: "#4338ca" },
  { name: "Stone Wash", hex: "#94a3b8" },
];

export function ProductModal() {
  const { addProduct, updateProduct, modals, setModal } =
    useAdmin();

  const isAddOpen = modals.addProduct;
  const isEditOpen = modals.editProduct.isOpen;
  const editProduct = modals.editProduct.product;

  const isOpen = isAddOpen || isEditOpen;
  const mode = isAddOpen ? "add" : "edit";
  const product = editProduct;
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondFileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
    hoverImage: "",
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
        hoverImage: product.hoverImage || "",
        status: product.status,
        sizes: product.sizes,
        colors: product.colors,
      });
      setImagePreviews([product.image, product.hoverImage].filter(Boolean));
      setImageFiles([]);
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
        hoverImage: "",
        status: "active",
        sizes: [],
        colors: [],
      });
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [product, mode, isOpen]);

  const handleClose = () => {
    if (mode === "add") {
      setModal("addProduct", false);
    } else {
      setModal("editProduct", { isOpen: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Product name is required");
        setIsLoading(false);
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Valid price is required");
        setIsLoading(false);
        return;
      }
      
      if (!formData.category) {
        toast.error("Category is required");
        setIsLoading(false);
        return;
      }
      
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error("Valid stock quantity is required");
        setIsLoading(false);
        return;
      }
      
      if (formData.sizes.length === 0) {
        toast.error("At least one size must be selected");
        setIsLoading(false);
        return;
      }
      
      if (formData.colors.length === 0) {
        toast.error("At least one color must be selected");
        setIsLoading(false);
        return;
      }

      if (!formData.image && imageFiles.length === 0) {
        toast.error("Product image is required");
        setIsLoading(false);
        return;
      }

      // Handle image uploads if files are selected
      let imageUrl = formData.image;
      let hoverImageUrl = formData.hoverImage;
      
      if (imageFiles.length > 0) {
        if (imageFiles[0]) {
          // In a real application, you would upload the file to your storage service
          // For now, we'll use the preview URL (in production, replace with actual upload logic)
          imageUrl = imagePreviews[0];
        }
        if (imageFiles[1]) {
          hoverImageUrl = imagePreviews[1];
        }
        toast.success("Images uploaded successfully!");
      }

      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        description: formData.description.trim(),
        image: imageUrl || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
        hoverImage: hoverImageUrl,
        status: formData.status,
        sizes: formData.sizes,
        colors: formData.colors,
      };

      if (mode === "add") {
        await addProduct(productData);
        toast.success("Product added successfully!");
      } else if (product) {
        await updateProduct(product.id, productData);
        toast.success("Product updated successfully!");
      }

      handleClose();
    } catch (error) {
      console.error("Error saving product:", error);
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

  const handleColorToggle = (colorName: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, imageIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.', { duration: 2000 });
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB.');
        return;
      }

      // Update files array
      const newFiles = [...imageFiles];
      newFiles[imageIndex] = file;
      setImageFiles(newFiles);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newPreviews = [...imagePreviews];
        newPreviews[imageIndex] = result;
        setImagePreviews(newPreviews);
        
        // Update form data
        if (imageIndex === 0) {
          setFormData((prev) => ({ ...prev, image: result }));
        } else if (imageIndex === 1) {
          setFormData((prev) => ({ ...prev, hoverImage: result }));
        }
      };
      reader.readAsDataURL(file);
      
      toast.success(`Image ${imageIndex + 1} selected successfully!`);
    }
  };

  const triggerFileUpload = (imageIndex: number) => {
    if (imageIndex === 0) {
      fileInputRef.current?.click();
    } else {
      secondFileInputRef.current?.click();
    }
  };

  const removeImage = (imageIndex: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    
    newFiles.splice(imageIndex, 1);
    newPreviews.splice(imageIndex, 1);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    
    if (imageIndex === 0) {
      setFormData((prev) => ({ ...prev, image: "" }));
    } else if (imageIndex === 1) {
      setFormData((prev) => ({ ...prev, hoverImage: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 m-0 md:m-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold">
            {mode === "add"
              ? "Add New Product"
              : "Edit Product"}
          </DialogTitle>
          <DialogDescription className="text-sm mt-2">
            {mode === "add"
              ? "Create a new product for your store. Fill in all the required information below."
              : "Update the product information. Make sure all required fields are completed."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              Basic Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Product Name *
              </Label>
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
                className="h-12 text-base w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-base font-medium">
                Price (₦) *
              </Label>
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
                className="h-12 text-base w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              >
                <SelectTrigger className="h-12 text-base w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-base font-medium">
                Stock Quantity *
              </Label>
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
                className="h-12 text-base w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger className="h-12 text-base w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              Product Details
            </h3>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter detailed product description"
                rows={4}
                className="text-base w-full"
                required
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              Product Images
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Image */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Primary Image *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => triggerFileUpload(0)}
                    className="h-12 px-6 w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Primary Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 0)}
                    className="hidden"
                  />
                </div>

                {imagePreviews[0] ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-64 rounded-lg border border-gray-300 overflow-hidden bg-gray-50">
                      <img
                        src={imagePreviews[0]}
                        alt="Primary preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(0)}
                        className="absolute top-2 right-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No primary image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Image */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Hover Image (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => triggerFileUpload(1)}
                    className="h-12 px-6 w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Hover Image
                  </Button>
                  <input
                    ref={secondFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 1)}
                    className="hidden"
                  />
                </div>

                {imagePreviews[1] ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-64 rounded-lg border border-gray-300 overflow-hidden bg-gray-50">
                      <img
                        src={imagePreviews[1]}
                        alt="Hover preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(1)}
                        className="absolute top-2 right-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No hover image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Upload up to 2 images (max 100MB each, JPG/PNG). The hover image will be shown when customers hover over the product.
            </p>
          </div>



          {/* Variants Section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              Product Variants
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Available Sizes *
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {SIZES.map((size) => (
                    <div
                      key={size}
                      className={`flex items-center justify-center h-12 rounded-lg border cursor-pointer transition-all duration-200 ${
                        formData.sizes.includes(size)
                          ? "bg-primary border-primary text-white shadow-md"
                          : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      <span className="font-medium text-sm">
                        {size}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Select all sizes available for this product
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Available Colors *
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COLORS.map((color) => (
                    <div
                      key={color.name}
                      className={`relative flex items-center justify-between h-12 px-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        formData.colors.includes(color.name)
                          ? "bg-primary border-primary text-white shadow-md"
                          : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                      onClick={() => handleColorToggle(color.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            color.name === "White" ? "border-gray-400" : "border-gray-200"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-medium text-sm">
                          {color.name}
                        </span>
                      </div>
                      {formData.colors.includes(color.name) && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Select all colors available for this product
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-12 px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8"
            >
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