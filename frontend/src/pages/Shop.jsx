import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryParam = queryParams.get('category') || '';
  const [filters, setFilters] = useState({ category: categoryParam, material: '', color: '', sort: 'Newest Arrivals' });

  useEffect(() => {
    const categoryParam = queryParams.get('category');
    if (categoryParam !== null && categoryParam !== filters.category) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          ...(filters.category && { category: filters.category }),
          ...(filters.material && { material: filters.material }),
          ...(filters.color && { color: filters.color }),
          ...(filters.sort && { sort: filters.sort }),
          ...(searchTerm && { search: searchTerm })
        });
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, searchTerm]);

  return (
    <>
      <Navbar />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-16 pt-unit-lg pb-section-gap mt-16">
        {/* Hero Header */}
        <header className="mb-unit-lg text-center md:text-left">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'The Heritage Collection'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {searchTerm 
              ? `Showing results matching your query. Explore our artisanal Pakistani textiles.`
              : 'A curated selection of artisanal Pakistani textiles, hand-embroidered with precision and woven with centuries of heritage.'}
          </p>
        </header>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 border-y border-outline-variant gap-unit-md mb-unit-lg">
          <div className="flex flex-wrap gap-element-gap items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Filter by:</span>
            
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 bg-surface-container-low border border-outline-variant font-label-caps text-label-caps focus:ring-primary focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="Stitched">Stitched</option>
              <option value="Unstitched">Unstitched</option>
            </select>

            <select 
              value={filters.material} 
              onChange={(e) => setFilters({...filters, material: e.target.value})}
              className="px-4 py-2 bg-surface-container-low border border-outline-variant font-label-caps text-label-caps focus:ring-primary focus:border-primary"
            >
              <option value="">All Fabrics</option>
              <option value="Silk">Silk</option>
              <option value="Cotton">Cotton</option>
              <option value="Linen">Linen</option>
              <option value="Velvet">Velvet</option>
            </select>

            <select 
              value={filters.color} 
              onChange={(e) => setFilters({...filters, color: e.target.value})}
              className="px-4 py-2 bg-surface-container-low border border-outline-variant font-label-caps text-label-caps focus:ring-primary focus:border-primary"
            >
              <option value="">All Colors</option>
              <option value="Ivory">Ivory</option>
              <option value="Midnight Blue">Midnight Blue</option>
              <option value="Sage Green">Sage Green</option>
              <option value="Charcoal">Charcoal</option>
            </select>

          </div>
          <div className="flex items-center gap-element-gap w-full lg:w-auto justify-between lg:justify-start">
            <p className="font-label-caps text-label-caps text-on-surface-variant">{products.length} Products</p>
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Sort:</span>
              <select 
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="bg-transparent border-none focus:ring-0 font-label-caps text-label-caps text-primary cursor-pointer p-0"
              >
                <option value="Newest Arrivals">Newest Arrivals</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-error">
            <p>Error loading products: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-gutter gap-y-10 sm:gap-y-16">
            {products.map((product) => (
              <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="product-card group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-unit-md">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={product.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBWSJkgOMNQcxB23wGvoZA24-fHWy1miwFy8S-DWusLUW7poLC5blz0X7ZZitQTf7eE6ZyquUmoHsLfyBZU5C0KkKcjS31IH5N1Zh0_Lq4qW6NnAfz_108PkhWrqppHRxKWnTjPysSra4FPowOKPh6PJ8kg3TdtKpV_D1GgdD07oBpxCk8Nq2lgd4Ga1No_hGdIENXcH6uCwEIfsS4oQC9VH43PDJozJSGQVA0f0Mk25jLFrcWYAo9zzg11gg5U5RT7c6Ggjc8AkRIy"} 
                    alt={product.name}
                  />
                  <div className="product-card-overlay absolute inset-0 hidden lg:flex flex-col items-center justify-end p-6 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 lg:bg-white/40 lg:backdrop-blur-sm">
                    <div className="w-full space-y-2 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          navigate('/cart');
                        }} 
                        className="w-full bg-primary text-white py-3 font-label-caps text-label-caps hover:bg-surface-tint transition-colors"
                      >
                        Add to Cart
                      </button>
                      <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()} className="w-full block text-center bg-white text-primary border border-primary py-3 font-label-caps text-label-caps hover:bg-primary-fixed transition-colors">Quick View</Link>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-headline-sm text-sm sm:text-headline-sm text-primary mb-1 line-clamp-1">{product.name}</h3>
                  <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">PKR {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination / Load More */}
        <div className="mt-20 mb-32 flex flex-col items-center gap-unit-md">
          <button className="px-12 py-4 border border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-white transition-all duration-500 ease-out">
            Discover More
          </button>
          <div className="flex items-center gap-4 mt-unit-md">
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-primary hover:bg-surface-container-low">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-label-caps text-label-caps">1 / 3</span>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-primary hover:bg-surface-container-low">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
