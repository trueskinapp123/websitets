import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#306b59] animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-playfair font-bold text-[#306b59] mb-2">
          Loading TrueSkin...
        </h2>
        <p className="text-gray-600 font-lato">
          Please wait while we load your experience
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
