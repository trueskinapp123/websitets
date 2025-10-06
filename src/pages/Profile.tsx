import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService, UserProfile } from '../services/userService';
import Navigation from '../components/Navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Loader } from 'lucide-react';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    dateOfBirth: '',
    gender: ''
  });

  useEffect(() => {
    if (user && profile) {
      setProfileData(profile);
      setFormData({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        addressLine1: profile.address_line1 || '',
        addressLine2: profile.address_line2 || '',
        city: profile.city || '',
        state: profile.state || '',
        postalCode: profile.postal_code || '',
        country: profile.country || 'India',
        dateOfBirth: profile.date_of_birth || '',
        gender: profile.gender || ''
      });
    }
  }, [user, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updates = {
        full_name: formData.fullName,
        phone: formData.phone,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender
      };

      const result = await updateProfile(updates);
      if (result.error) {
        console.error('Error updating profile:', result.error);
        alert('Failed to update profile. Please try again.');
      } else {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        fullName: profileData.full_name || '',
        phone: profileData.phone || '',
        addressLine1: profileData.address_line1 || '',
        addressLine2: profileData.address_line2 || '',
        city: profileData.city || '',
        state: profileData.state || '',
        postalCode: profileData.postal_code || '',
        country: profileData.country || 'India',
        dateOfBirth: profileData.date_of_birth || '',
        gender: profileData.gender || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-white shadow-sm">
          <Navigation />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="font-playfair text-3xl font-bold text-[#803716] mb-4">
              Please Sign In
            </h1>
            <p className="font-lato text-gray-600 mb-8">
              You need to be signed in to view your profile.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
              className="bg-[#e58f5a] hover:bg-[#b66837] text-white px-8 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <Navigation />
      </div>

      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-[#803716] mb-6">
            My Profile
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Manage your personal information and preferences
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#e58f5a] to-[#b66837] p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold">
                      {profileData?.full_name || user.email?.split('@')[0] || 'User'}
                    </h2>
                    <p className="font-lato text-white/90 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    <p className="font-lato text-white/90 flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      Joined {profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#803716] mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData?.full_name || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {profileData?.phone || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                        />
                      ) : (
                        <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData?.date_of_birth ? new Date(profileData.date_of_birth).toLocaleDateString() : 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg capitalize">
                          {profileData?.gender || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#803716] mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                          placeholder="Street address"
                        />
                      ) : (
                        <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData?.address_line1 || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                          placeholder="Apartment, suite, etc."
                        />
                      ) : (
                        <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData?.address_line2 || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                            placeholder="City"
                          />
                        ) : (
                          <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                            {profileData?.city || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                            placeholder="State"
                          />
                        ) : (
                          <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                            {profileData?.state || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                            placeholder="Postal code"
                          />
                        ) : (
                          <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                            {profileData?.postal_code || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        {isEditing ? (
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                          >
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="Canada">Canada</option>
                            <option value="UK">UK</option>
                            <option value="Australia">Australia</option>
                          </select>
                        ) : (
                          <p className="font-lato text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                            {profileData?.country || 'India'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#e58f5a] hover:bg-[#b66837] text-white px-8 py-3 rounded-full font-lato font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-lato font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
