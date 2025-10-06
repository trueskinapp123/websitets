import { supabase } from '../lib/supabase';
import { Product } from '../contexts/CartContext';
import { getAllProducts, getProductById as getLocalProductById } from '../data/products.ts';

export const productService = {
  // Get all products from local data for instant loading
  async getProducts(): Promise<Product[]> {
    console.log('Loading products from local data...');
    
    // Return local products immediately for instant loading
    const products = getAllProducts();
    console.log('Products loaded from local data:', products.length);
    
    return products;
  },

  // Get product by ID from local data
  async getProductById(id: string): Promise<Product | null> {
    console.log('Loading product from local data:', id);
    
    const product = getLocalProductById(id);
    if (!product) {
      console.error('Product not found:', id);
      return null;
    }
    
    console.log('Product loaded from local data:', product.name);
    return product;
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

