import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center max-w-md shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-lightgreen text-primary flex items-center justify-center mx-auto">
          <Sprout className="w-8 h-8 text-accent" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-darktext">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          The orchard lane you're looking for doesn't exist or has moved. Return to our farm produce catalog.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

