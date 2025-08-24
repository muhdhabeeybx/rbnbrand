import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";

export function NewArrivals() {
  const products = [
    {
      id: "1",
      name: "Essential Hoodie",
      price: 45000,
      image: "https://images.unsplash.com/photo-1734003066406-33aa5fba6821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwaG9vZGllJTIwbW9kZWwlMjBibGFjayUyMHdoaXRlfGVufDF8fHx8MTc1NTkzODQ2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Hoodies",
      isNew: true
    },
    {
      id: "2",
      name: "Minimal Tee",
      price: 18000,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtaW5pbWFsaXN0JTIwdC1zaGlydCUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3NTU5Mzg0NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "T-Shirts",
      isNew: true
    },
    {
      id: "3",
      name: "Urban Jacket",
      price: 85000,
      image: "https://images.unsplash.com/photo-1559038217-3fb2db6186f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzdHJlZXR3ZWFyJTIwamFja2V0JTIwdXJiYW4lMjBmYXNoaW9ufGVufDF8fHx8MTc1NTkzODQ2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Outerwear",
      isNew: true
    },
    {
      id: "4",
      name: "Statement Hoodie",
      price: 52000,
      image: "https://images.unsplash.com/photo-1734003066406-33aa5fba6821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwaG9vZGllJTIwbW9kZWwlMjBibGFjayUyMHdoaXRlfGVufDF8fHx8MTc1NTkzODQ2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Hoodies",
      isNew: false
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">New Arrivals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Fresh drops for the culture. Each piece crafted with intention, 
          designed for those who move with purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" variant="outline" className="px-8">
          View All Products
        </Button>
      </div>
    </section>
  );
}