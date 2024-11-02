import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductCardProps {
  imageSrc?: string;
  productName?: string;
  description?: string;
  listing?: number;
  category?: string;
}

export default function ProductCard({
  imageSrc = "/placeholder.svg?height=300&width=400",
  productName = "Minimalist Watch",
  //description = "Sleek design for everyday elegance",
  listing = 129.99,
  category = "Accessories",
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm bg-secondary text-card-foreground rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="relative aspect-[0] w-full overflow-hidden group">
          <img
            src={imageSrc}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
        {category && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            {category}
          </Badge>
        )}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-left animate-fadeIn">
            {productName}
          </h2>
          <p className=" mb-4 text-left animate-fadeIn animation-delay-200">
            {"test"}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold  animate-fadeIn animation-delay-400">
              ${listing.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:scale-110 active:scale-95`}
              aria-label={isAdded ? "Added to cart" : "Add to cart"}
            >
              <div
                className={`transition-transform duration-300 ${
                  isAdded ? "animate-rotate-sequence" : ""
                }`}
              >
                {isAdded ? (
                  <Check className="h-6 w-6 animate-checkmark" />
                ) : (
                  <ShoppingCart className="h-6 w-6" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      <style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes checkmark {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes rotateSequence {
    100% { transform: rotate(360deg); }
  }
  .animate-fadeIn {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
  }
  .animation-delay-200 {
    animation-delay: 0.2s;
  }
  .animation-delay-400 {
    animation-delay: 0.4s;
  }
  .animate-checkmark {
    animation: checkmark 0.3s ease-out;
  }
  .animate-rotate-sequence {
    animation: rotateSequence 0.4s ease-in-out;
  }
`}</style>
    </div>
  );
}
