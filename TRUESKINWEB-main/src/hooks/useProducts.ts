import { useQuery } from '@tanstack/react-query';
import { getAllProducts, getProductById as getLocalProductById } from '../data/products.js';
import { Product } from '../contexts/CartContext';

// Local product fetch function for instant loading
const fetchProducts = async (): Promise<Product[]> => {
  console.log('Loading products from local data...');
  
  // Simulate a small delay to show the skeleton loader briefly
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const products = getAllProducts();
  console.log('Products loaded from local data:', products.length);
  
  return products;
};

// React Query hook for products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for individual product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Loading product from local data:', id);
      
      // Simulate a small delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const product = getLocalProductById(id);
      if (!product) {
        console.error('Product not found:', id);
        return null;
      }
      
      console.log('Product loaded from local data:', product.name);
      return product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
