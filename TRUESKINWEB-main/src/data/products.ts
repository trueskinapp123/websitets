import { Product } from '../contexts/CartContext';

export const products: Product[] = [
  {
    id: "heal-pack",
    name: "Heal Pack",
    count: "4 Masks",
    originalPrice: 420,
    price: 304,
    discount: "5% OFF",
    description:
      "Perfect starter pack for first-time users. Experience the power of premium collagen with our carefully curated 4-mask collection designed to introduce your skin to the TrueSkin difference.",
    rating: 4.8,
    reviews: 124,
    images: [
      "/images/p4.png",
      "/images/prd.jpg",
      "/images/tsp.jpg",
    ],
  },
  {
    id: "fresh-pack",
    name: "Fresh Pack",
    count: "8 Masks",
    originalPrice: 800,
    price: 576,
    discount: "5% OFF",
    description:
      "Most popular choice for regular users. Transform your skincare routine with our 8-mask collection, perfect for maintaining that radiant glow throughout the month.",
    rating: 4.9,
    reviews: 286,
    popular: true,
    images: [
      "/images/p8.png",
      "/images/prd.jpg",
      "/images/tsp.jpg",
    ],
  },
  {
    id: "glow-pack",
    name: "Glow Pack",
    count: "12 Masks",
    originalPrice: 1158,
    price: 816,
    discount: "5% OFF",
    description:
      "Best value for skincare enthusiasts. Our premium 12-mask collection offers the ultimate skincare experience with maximum savings and long-lasting results.",
    rating: 4.9,
    reviews: 198,
    images: [
      "/images/p12.png",
      "/images/prd.jpg",
      "/images/tsp.jpg",
    ],
  },
];

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get popular products
export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.popular);
};

// Helper function to get all products sorted by popularity and date
export const getAllProducts = (): Product[] => {
  return [...products].sort((a, b) => {
    // Popular products first
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    // Then by rating (highest first)
    return b.rating - a.rating;
  });
};
