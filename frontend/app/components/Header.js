'use client';

import { useAuth } from '../AuthContext';
import Link from 'next/link';

export default function Header() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              Dropship <span className="text-purple-400">Hunter</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/wishlist" className="text-gray-300 hover:text-white transition">
                  My Wishlist
                </Link>
                <button onClick={logout} className="text-gray-300 hover:text-white transition">
                  Logout
                </button>
                <img src={user.photoURL} alt="User profile" className="w-8 h-8 rounded-full" />
              </>
            ) : (
              <button onClick={loginWithGoogle} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
