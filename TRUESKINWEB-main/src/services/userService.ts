import { supabase } from '../lib/supabase';

export interface UserAddress {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        dateOfBirth: data.date_of_birth,
        gender: data.gender,
        addressLine1: data.address_line1,
        addressLine2: data.address_line2,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const updateData: any = {};
      
      if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
      if (updates.dateOfBirth !== undefined) updateData.date_of_birth = updates.dateOfBirth;
      if (updates.gender !== undefined) updateData.gender = updates.gender;
      if (updates.addressLine1 !== undefined) updateData.address_line1 = updates.addressLine1;
      if (updates.addressLine2 !== undefined) updateData.address_line2 = updates.addressLine2;
      if (updates.city !== undefined) updateData.city = updates.city;
      if (updates.state !== undefined) updateData.state = updates.state;
      if (updates.postalCode !== undefined) updateData.postal_code = updates.postalCode;
      if (updates.country !== undefined) updateData.country = updates.country;

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        dateOfBirth: data.date_of_birth,
        gender: data.gender,
        addressLine1: data.address_line1,
        addressLine2: data.address_line2,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return null;
    }
  },

  // Get user addresses
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user addresses:', error);
        return [];
      }

      return data?.map(addr => ({
        id: addr.id,
        userId: addr.user_id,
        type: addr.type,
        fullName: addr.full_name,
        phone: addr.phone,
        addressLine1: addr.address_line1,
        addressLine2: addr.address_line2,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postal_code,
        country: addr.country,
        isDefault: addr.is_default,
        createdAt: addr.created_at,
        updatedAt: addr.updated_at
      })) || [];
    } catch (error) {
      console.error('Error in getUserAddresses:', error);
      return [];
    }
  },

  // Add user address
  async addUserAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<UserAddress | null> {
    try {
      // If this is set as default, unset other default addresses
      if (address.isDefault) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .eq('type', address.type);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: userId,
          type: address.type,
          full_name: address.fullName,
          phone: address.phone,
          address_line1: address.addressLine1,
          address_line2: address.addressLine2,
          city: address.city,
          state: address.state,
          postal_code: address.postalCode,
          country: address.country,
          is_default: address.isDefault
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding user address:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        fullName: data.full_name,
        phone: data.phone,
        addressLine1: data.address_line1,
        addressLine2: data.address_line2,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
        isDefault: data.is_default,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in addUserAddress:', error);
      return null;
    }
  },

  // Update user address
  async updateUserAddress(addressId: string, updates: Partial<UserAddress>): Promise<UserAddress | null> {
    try {
      // If this is set as default, unset other default addresses of the same type
      if (updates.isDefault) {
        const { data: addressData } = await supabase
          .from('user_addresses')
          .select('user_id, type')
          .eq('id', addressId)
          .single();

        if (addressData) {
          await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', addressData.user_id)
            .eq('type', addressData.type)
            .neq('id', addressId);
        }
      }

      const updateData: any = {};
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.addressLine1 !== undefined) updateData.address_line1 = updates.addressLine1;
      if (updates.addressLine2 !== undefined) updateData.address_line2 = updates.addressLine2;
      if (updates.city !== undefined) updateData.city = updates.city;
      if (updates.state !== undefined) updateData.state = updates.state;
      if (updates.postalCode !== undefined) updateData.postal_code = updates.postalCode;
      if (updates.country !== undefined) updateData.country = updates.country;
      if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;

      const { data, error } = await supabase
        .from('user_addresses')
        .update(updateData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user address:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        fullName: data.full_name,
        phone: data.phone,
        addressLine1: data.address_line1,
        addressLine2: data.address_line2,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
        isDefault: data.is_default,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in updateUserAddress:', error);
      return null;
    }
  },

  // Delete user address
  async deleteUserAddress(addressId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        console.error('Error deleting user address:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUserAddress:', error);
      return false;
    }
  },

  // Get user orders
  async getUserOrders(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              name,
              images
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      return [];
    }
  },

  // Get user notifications
  async getUserNotifications(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      return false;
    }
  }
};
