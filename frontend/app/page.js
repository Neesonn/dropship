// frontend/app/page.js
'use client';

import Link from 'next/link'; // Import the Link component for navigation

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          Dropship <span className="text-purple-400">Hunter</span>
        </h1>
        <p className="text-gray-400 mt-4 text-xl">Choose your hunting ground.</p>
      </header>

      {/* Grid container for the source selection buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        
        {/* AliExpress Button - Updated with Image Icon and Modern Styling */}
        <Link 
          href="/hunt/aliexpress" 
          className="relative flex flex-col items-center justify-center p-8 rounded-xl
                     bg-white/5 backdrop-blur-lg border border-white/10 {/* Changed background and border here */}
                     shadow-lg hover:shadow-xl
                     transform hover:-translate-y-2 transition-all duration-300
                     group overflow-hidden"
        >
          {/* Background overlay for hover effect (remains red) */}
          <div className="absolute inset-0 bg-red-400/5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>

          {/* AliExpress Icon (using an <img> tag for your provided image) */}
          <div className="mb-4 relative z-10 flex items-center justify-center rounded-full p-2">
            <img 
              src="/aliexpress-logo.png" // Placeholder path: YOU MUST PLACE YOUR IMAGE IN public/aliexpress-logo.png
              alt="AliExpress Logo" 
              className="w-24 h-24 object-contain rounded-lg" // Increased size (w-24 h-24) and added rounded-lg
              onError={(e) => { 
                e.target.onerror = null; // Prevents infinite loop if fallback also fails
                e.target.src = "https://placehold.co/96x96/ef4444/ffffff?text=AE"; // Fallback placeholder, adjusted size
                e.target.className = "w-24 h-24 flex items-center justify-center text-xl font-bold text-white bg-red-600 rounded-lg"; // Apply styles for fallback, adjusted size and rounding
              }}
            />
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-2 relative z-10">AliExpress</h2>
          <p className="text-gray-300 group-hover:text-red-200 transition relative z-10 text-lg"> {/* Adjusted text color */}
            Hunt for top trending products.
          </p>
        </Link>
        
        {/* Temu Button (Coming Soon) - Updated Styling */}
        <div className="relative flex flex-col items-center justify-center p-8 rounded-xl
                    bg-gray-800/40 backdrop-blur-lg border border-gray-700/30
                    shadow-lg opacity-70 cursor-not-allowed
                    group overflow-hidden">
          {/* Icon/Text for Temu (simple 'T' or similar) */}
          <div className="text-5xl mb-4 relative z-10 text-gray-400">T</div>
          <h2 className="text-3xl font-bold text-gray-300 mb-2 relative z-10">Temu</h2>
          <p className="text-gray-500 relative z-10 text-lg">(Coming Soon)</p>
        </div>

        {/* Amazon Button (Coming Soon) - Updated Styling */}
        <div className="relative flex flex-col items-center justify-center p-8 rounded-xl
                    bg-gray-800/40 backdrop-blur-lg border border-gray-700/30
                    shadow-lg opacity-70 cursor-not-allowed
                    group overflow-hidden">
          {/* Icon/Text for Amazon (simple 'A' or parcel emoji) */}
          <div className="text-5xl mb-4 relative z-10 text-gray-400">📦</div>
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Amazon</h2>
          <p className="text-gray-500 relative z-10 text-lg">(Coming Soon)</p>
        </div>
      </div>
    </main>
  );
}
