import { useState, useMemo } from 'react';
import { useProducts } from './useProducts';

export const useProductsPagination = (itemsPerPage: number = 6) => {
  const { data: allProducts = [], isLoading, error, refetch } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  
  // Get products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allProducts.slice(startIndex, endIndex);
  }, [allProducts, currentPage, itemsPerPage]);

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    products: paginatedProducts,
    allProducts,
    isLoading,
    error,
    refetch,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    itemsPerPage,
    totalItems: allProducts.length
  };
};
