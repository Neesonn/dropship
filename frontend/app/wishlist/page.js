'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, db } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
        const wishlistData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setWishlist(wishlistData);
        setLoading(false);
      });
      return () => unsubscribe(); // Cleanup listener on unmount
    } else {
      setLoading(false);
    }
  }, [user, db]);

  if (loading) {
    return <div className="text-center py-12 text-white">Loading Wishlist...</div>;
  }

  if (!user) {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-white">Please Login</h1>
            <p className="text-gray-400 mt-4">You need to be logged in to view your wishlist.</p>
        </div>
    )
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12">
        <header className="w-full max-w-7xl mx-auto mb-12 text-center">
            <h1 className="text-5xl font-bold text-white">My <span className="text-purple-400">Wishlist</span></h1>
        </header>
        <div className="w-full max-w-7xl mx-auto">
        {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {wishlist.map((product) => (
                <a
                    key={product.id}
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="isolate flex flex-col bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300"
                >
                    <div className="relative aspect-square w-full bg-white/10">
                    <img
                        src={product.imageUrl || 'https://placehold.co/400x400/0c0a09/4a4a4a?text=No+Image'}
                        alt={product.title}
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/0c0a09/4a4a4a?text=No+Image'; }}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between" style={{height: '8rem'}}>
                    <h3 className="text-white font-semibold text-sm leading-tight overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {product.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-lg font-bold text-purple-400">{product.price}</p>
                    </div>
                    </div>
                </a>
                ))}
            </div>
            ) : (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white">Your Wishlist is Empty</h2>
                <p className="text-gray-400 mt-2">Start hunting to find products to save!</p>
                <Link href="/" className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">Go Hunting</Link>
            </div>
            )}
        </div>
    </main>
  );
}
