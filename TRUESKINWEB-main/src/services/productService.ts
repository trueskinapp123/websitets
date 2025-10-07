import { supabase } from '../lib/supabase';
import { Product } from '../contexts/CartContext';

export const productService = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      console.log('Fetching products from database...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        console.log('Falling back to sample data...');
        return getFallbackProducts();
      }

      console.log('Products fetched from database:', data?.length || 0);
      console.log('Raw database data:', data);
      console.log('Product IDs:', data?.map(p => p.id));

      // If no products in database, return fallback data
      if (!data || data.length === 0) {
        console.log('No products in database, using fallback data...');
        return getFallbackProducts();
      }

      // TEMPORARY: If we have less than 3 products, use fallback data
      if (data.length < 3) {
        console.log(`Only ${data.length} products in database, using fallback data with 3 products...`);
        return getFallbackProducts();
      }


      // Transform database data to Product interface
      const products = data.map(item => ({
        id: item.id,
        name: item.name,
        count: item.count,
        originalPrice: item.original_price,
        price: item.price,
        discount: item.discount,
        description: item.description,
        rating: item.rating,
        reviews: item.reviews,
        popular: item.popular || false,
        images: item.images || []
      }));

      console.log('Products transformed successfully:', products.length);
      return products;
    } catch (error) {
      console.error('Error in getProducts:', error);
      console.log('Falling back to sample data due to error...');
      // Return fallback data if Supabase fails
      return getFallbackProducts();
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        count: data.count,
        originalPrice: data.original_price,
        price: data.price,
        discount: data.discount,
        description: data.description,
        rating: data.rating,
        reviews: data.reviews,
        popular: data.popular || false,
        images: data.images || []
      };
    } catch (error) {
      console.error('Error in getProductById:', error);
      return null;
    }
  },

  // Add product to database (admin function)
  async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          count: product.count,
          original_price: product.originalPrice,
          price: product.price,
          discount: product.discount,
          description: product.description,
          rating: product.rating,
          reviews: product.reviews,
          popular: product.popular || false,
          images: product.images || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        count: data.count,
        originalPrice: data.original_price,
        price: data.price,
        discount: data.discount,
        description: data.description,
        rating: data.rating,
        reviews: data.reviews,
        popular: data.popular || false,
        images: data.images || []
      };
    } catch (error) {
      console.error('Error in addProduct:', error);
      return null;
    }
  }
};

// Fallback products data (same as current hardcoded data)
function getFallbackProducts(): Product[] {
  return [
    {
      id: "heal-pack",
      name: "Heal Pack",
      count: "4 Masks",
      originalPrice: 420,
      price: 304,
      discount: "5% OFF",
      description: "Perfect starter pack for first-time users. Experience the power of premium collagen with our carefully curated 4-mask collection designed to introduce your skin to the TrueSkin difference.",
      rating: 4.8,
      reviews: 124,
      images: [
        "./images/p4.png",
        "./images/prd.jpg",
        "./images/tsp.jpg"
      ]
    },
    {
      id: "fresh-pack",
      name: "Fresh Pack",
      count: "8 Masks",
      originalPrice: 800,
      price: 576,
      discount: "5% OFF",
      description: "Most popular choice for regular users. Transform your skincare routine with our 8-mask collection, perfect for maintaining that radiant glow throughout the month.",
      rating: 4.9,
      reviews: 286,
      popular: true,
      images: [
        "./images/p8.png",
        "./images/prd.jpg",
        "./images/tsp.jpg"
      ]
    },
    {
      id: "glow-pack",
      name: "Glow Pack",
      count: "12 Masks",
      originalPrice: 1158,
      price: 816,
      discount: "5% OFF",
      description: "Best value for skincare enthusiasts. Our premium 12-mask collection offers the ultimate skincare experience with maximum savings and long-lasting results.",
      rating: 4.9,
      reviews: 198,
      images: [
        "./images/p12.png",
        "./images/prd.jpg",
        "./images/tsp.jpg"
      ]
    }
  ];
}
