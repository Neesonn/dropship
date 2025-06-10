// frontend/app/hunt/[source]/page.js
'use client'; 

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ring } from 'ldrs'
import { useAuth } from '../../AuthContext'; // Corrected path to AuthContext
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore'; // Import Firestore functions

if (typeof window !== 'undefined') {
  ring.register()
}

const Loader = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-12">
    <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="white"></l-ring>
    <p className="text-gray-400 mt-4">{text}</p>
  </div>
);

// Profit Calculator Modal Component
const ProfitCalculatorModal = ({ product, onClose }) => {
  const [salePrice, setSalePrice] = useState('');
  const [shippingCost, setShippingCost] = useState('5.00');
  const [platformFee, setPlatformFee] = useState('2.9');
  
  const [competitors, setCompetitors] = useState([]);
  const [competitorStatus, setCompetitorStatus] = useState('idle');

  const productCost = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
  const salePriceNum = parseFloat(salePrice) || 0;
  const shippingCostNum = parseFloat(shippingCost) || 0;
  const platformFeePercent = parseFloat(platformFee) || 0;
  
  const feeAmount = salePriceNum * (platformFeePercent / 100);
  const profit = salePriceNum - (productCost + shippingCostNum + feeAmount);
  const margin = salePriceNum > 0 ? (profit / salePriceNum) * 100 : 0;

  const handleCompetitorSearch = async () => {
    setCompetitorStatus('loading');
    try {
      // NOTE: For deployment, 'http://localhost:3001' needs to be replaced with your deployed backend URL.
      // Example: const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/competitors?query=${encodeURIComponent(product.title)}`);
      const response = await fetch(`http://localhost:3001/api/competitors?query=${encodeURIComponent(product.title)}`);
      if(!response.ok) throw new Error("Failed to fetch competitor data.");
      const data = await response.json();
      setCompetitors(data);
      setCompetitorStatus('success');
    } catch (error) {
      setCompetitorStatus('error');
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-purple-500/50 rounded-2xl shadow-xl w-full max-w-4xl text-white flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Side: Product Image & Links */}
        <div className="w-full md:w-1/3 flex-shrink-0 p-8 flex flex-col">
          <img src={product.imageUrl} alt={product.title} className="w-full aspect-square object-cover rounded-lg"/>
          <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="block w-full mt-4 text-center bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
            View on AliExpress
          </a>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(product.title)}`} target="_blank" rel="noopener noreferrer" className="block w-full mt-2 text-center bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Search on Google
          </a>
        </div>

        {/* Middle: Calculator */}
        <div className="w-full md:w-1/3 p-8 border-l border-r border-gray-700">
          <h2 className="text-xl font-bold mb-1">Profit Calculator</h2>
          <h3 className="text-gray-400 text-sm mb-6 truncate" title={product.title}>{product.title}</h3>
          <div className="space-y-4">
              <div>
              <label htmlFor="product-cost" className="block text-sm font-medium text-gray-400">Product Cost</label>
              <div className="mt-1 text-lg p-2 rounded-md bg-gray-800 border border-gray-700">{product.price}</div>
            </div>
              <div>
              <label htmlFor="shipping" className="block text-sm font-medium text-gray-400">Shipping Cost</label>
              <input type="number" id="shipping" value={shippingCost} onChange={e => setShippingCost(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"/>
            </div>
            <div>
              <label htmlFor="sale-price" className="block text-sm font-medium text-gray-400">Your Sale Price</label>
              <input type="number" id="sale-price" placeholder="e.g., 29.99" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"/>
            </div>
            <div>
              <label htmlFor="platform-fee" className="block text-sm font-medium text-gray-400">Platform Fee (%)</label>
              <input type="number" id="platform-fee" value={platformFee} onChange={e => setPlatformFee(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"/>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 flex justify-around text-center">
            <div>
              <p className="text-sm text-gray-400">Profit/Loss</p>
              <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-500'}`}>{profit.toFixed(2)}</p>
            </div>
              <div>
              <p className="text-sm text-gray-400">Margin</p>
              <p className={`text-3xl font-bold ${margin >= 0 ? 'text-green-400' : 'text-red-500'}`}>{margin.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Right Side: Competitor Spy */}
        <div className="w-full md:w-1/3 p-8 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Competitor Spy</h2>
            <button onClick={handleCompetitorSearch} disabled={competitorStatus === 'loading'} className="w-full bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-500">
                {competitorStatus === 'loading' ? 'Spying...' : 'Find Competitors'}
            </button>

            <div className="mt-6 space-y-3 flex-grow overflow-y-auto">
                {competitorStatus === 'loading' && <div className="text-center text-gray-400">Searching...</div>}
                {competitorStatus === 'success' && competitors.map((comp, index) => (
                    <a href={comp.url} target="_blank" rel="noopener noreferrer" key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition">
                        <span className="text-sm text-gray-300 truncate">{comp.storeName}</span>
                        <span className="font-bold text-indigo-400">{comp.price}</span>
                    </a>
                ))}
                {competitorStatus === 'success' && competitors.length === 0 && <div className="text-center text-gray-500">No competitors found.</div>}
                {competitorStatus === 'error' && <div className="text-center text-red-500">Could not fetch competitor data.</div>}
            </div>
        </div>
      </div>
    </div>
  );
};


// Main dashboard page component
export default function HuntPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const params = useParams();
  const source = params.source;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, db } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const toggleWishlist = async (product) => {
    if (!user) {
      // Replaced alert with a message box or a state-driven modal for better UX
      // since alerts are not allowed in Canvas or good practice in modern web apps.
      alert("Please login to save items to your wishlist."); // This will still use browser's alert if no custom modal implemented
      return;
    }

    const wishlistItemRef = doc(db, `users/${user.uid}/wishlist`, product.id);

    if (wishlistIds.has(product.id)) {
      await deleteDoc(wishlistItemRef);
    } else {
      await setDoc(wishlistItemRef, product);
    }
  };

  // Memoized fetchProductsFromDB with useCallback to avoid useEffect dependency warnings
  const fetchProductsFromDB = useCallback(async () => {
    if(status !== 'success') { setStatus('loading'); } // Ensure loading state if not already success
    try {
      // NOTE: For deployment, 'http://localhost:3001' needs to be replaced with your deployed backend URL.
      // Example: const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/products?source=${source}`);
      const response = await fetch(`http://localhost:3001/api/products?source=${source}`);
      if (!response.ok) { throw new Error('Failed to fetch products from the database.'); }
      const data = await response.json();
      setProducts(data);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [source, status, setProducts, setError, setStatus]); // Include all dependencies of the function

  useEffect(() => {
    if (source) { 
      fetchProductsFromDB(); 
    }
  }, [source, fetchProductsFromDB]); // Add fetchProductsFromDB to dependencies

  useEffect(() => {
    if(user && db) {
        const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
        const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
            const ids = new Set(snapshot.docs.map(doc => doc.id));
            setWishlistIds(ids);
        });
        return () => unsubscribe();
    }
  }, [user, db]);

  const handleRefreshRequest = async () => {
    setStatus('loading'); 
    setError(null);
    try {
      // NOTE: For deployment, 'http://localhost:3001' needs to be replaced with your deployed backend URL.
      // Example: const scrapeResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/scrape/${source}`);
      const scrapeResponse = await fetch(`http://localhost:3001/api/scrape/${source}`);
      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json();
        throw new Error(errorData.message || 'Failed to start the scraper.');
      }
      await fetchProductsFromDB();
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <>
      {selectedProduct && <ProfitCalculatorModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <main className="min-h-screen p-4 sm:p-8 md:p-12">
        <header className="w-full max-w-7xl mx-auto mb-12">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">&larr; Back to Dashboard</Link>
          <div className="text-center mt-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              <span className="capitalize">{source}</span> <span className="text-purple-400">Hunt</span>
              </h1>
          </div>
        </header>
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {products.length > 0 ? `Found ${products.length} Products` : 'Products'}
            </h2>
            <button
              onClick={handleRefreshRequest}
              disabled={status === 'loading'}
              className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin"></div>
                  <span>Hunting...</span>
                </>
              ) : (
                'Hunt for New Products'
              )}
            </button>
          </div>
          {status === 'loading' && <Loader text={`Loading products from ${source}...`} />}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center bg-red-900/20 rounded-xl p-8 border border-red-500/50">
              <h2 className="text-3xl font-bold text-red-400">An Error Occurred</h2>
              <p className="text-red-200 mt-2">{error}</p>
            </div>
          )}
          {status === 'success' && (
            <>
              {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="isolate flex flex-col bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden group">
                        <div className="relative aspect-square w-full bg-white/10 cursor-pointer" onClick={() => setSelectedProduct(product)}>
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
                            <button onClick={() => toggleWishlist(product)} disabled={!user} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 transition-all ${wishlistIds.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-500 hover:text-red-400'}`}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              ) : (
                status !== 'loading' && (
                  <div className="text-center py-12">
                    {/* FIXED: Escaped double quotes here */}
                    <h2 className="text-2xl font-bold text-white">No Products Found in Database</h2>
                    <p className="text-gray-400 mt-2">Click the &quot;Hunt for New Products&quot; button to populate the database.</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
