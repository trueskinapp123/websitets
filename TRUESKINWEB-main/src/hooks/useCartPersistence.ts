// This hook is no longer needed since we removed localStorage functionality
// Cart persistence is now handled entirely through Supabase for authenticated users
// and no persistence for unauthenticated users

export const useCartPersistence = () => {
  // No-op hook for backward compatibility
  // Cart persistence is now handled in CartContext
};
