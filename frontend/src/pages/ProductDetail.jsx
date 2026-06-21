import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdded, setIsAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
      // Fetch related products (e.g., same category or just some products)
      const fetchRelated = async () => {
        try {
          const data = await getProducts({ limit: 4 });
          setRelatedProducts(data.filter(p => p.id !== parseInt(id)).slice(0, 4));
        } catch (err) {
          console.error("Error fetching related products:", err);
        }
      };
      fetchRelated();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, size: selectedSize }, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh] text-error">
          <p>Error loading product: {error || 'Product not found'}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-12 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Gallery Section */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 h-auto md:h-[800px]">
            <div className="flex-1 aspect-[3/4] md:aspect-auto overflow-hidden relative group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in" src={product.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCcECAT-p8C2BiUQTDJhDdM-0HViJtyrWmYehFEjuhMPQoXEEbJYh959QcEcSvYsHFzTUu79cD5SQflrHgygVYDYq2OJOMzJIlDYHTQn-2APJ5a-Yawm9auX-BmLr1XahjQsazueOMFoL24AHQCnHt8NKrXQOGE-Um0y10OedjwlqGJLtskKeYY7_qagAxgflnb6eYxWns2fWHLSLq9SzcyikZft_MhUnXH7sv_culH6qVggIe3DkmAQdRmeeN6Puw_Ck5w2-a-rP2H"}/>
              <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-stone-700">zoom_in</span>
                </button>
              </div>
            </div>
          </div>
          {/* Product Info Section */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <nav className="flex gap-2 text-[10px] tracking-widest text-stone-400 mb-6 uppercase">
                <a href="#">Collections</a>
                <span>/</span>
                <a href="#">{product.category || "Shop"}</a>
                <span>/</span>
                <span className="text-stone-900">{product.name}</span>
              </nav>
              <h1 className="font-headline-md text-display-lg text-stone-900 mb-2">{product.name}</h1>
              <p className="text-stone-500 font-label-caps tracking-widest">ARTISAN SERIES NO. {product.id}</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-headline-md font-body-lg text-stone-800">PKR {product.price}</span>
            </div>
            <div className="h-[1px] bg-stone-100 w-full"></div>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
              {product.description || "A masterpiece of textile engineering, crafted from 100% long-staple Giza cotton with hand-applied zari embroidery. This ensemble honors the timeless heritage of Bin Arif Textiles through minimalist motifs and a contemporary silhouette."}
            </p>
            <div className="space-y-6">
              {product.category !== 'Unstitched' && (
              <div>
                <div className="flex justify-between mb-4">
                  <span className="font-label-caps tracking-widest text-stone-900">SELECT SIZE</span>
                  <button className="text-stone-400 text-[10px] underline tracking-widest hover:text-stone-900 transition-colors">SIZE GUIDE</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border text-xs tracking-widest uppercase transition-colors ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 hover:border-stone-900'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              )}
              <div className="flex gap-4">
                <div className="flex items-center border border-stone-200 px-4 py-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-6 font-body-md">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart} 
                  className={`flex-1 ${isAdded ? 'bg-stone-900' : 'bg-[#D4AF37] hover:bg-[#C19B2E]'} text-white font-label-caps tracking-widest py-4 transition-all duration-300`}
                >
                  {isAdded ? 'ADDED TO BAG' : 'ADD TO CART'}
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-2 border border-stone-200 py-4 font-label-caps tracking-widest hover:bg-stone-50 transition-colors">
                <span className="material-symbols-outlined text-sm">favorite</span>
                ADD TO WISHLIST
              </button>
            </div>
            {/* Tabs */}
            <div className="mt-8 border-t border-stone-100">
              <div className="flex gap-8 border-b border-stone-100">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`py-2 md:py-4 border-b text-[10px] tracking-widest uppercase transition-colors ${activeTab === 'description' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
                  Description
                </button>
                <button 
                  onClick={() => setActiveTab('material')}
                  className={`py-2 md:py-4 border-b text-[10px] tracking-widest uppercase transition-colors ${activeTab === 'material' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
                  Material & Care
                </button>
                <button 
                  onClick={() => setActiveTab('shipping')}
                  className={`py-2 md:py-4 border-b text-[10px] tracking-widest uppercase transition-colors ${activeTab === 'shipping' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
                  Shipping Info
                </button>
              </div>
              <div className="py-6 md:py-8 min-h-[150px]">
                {activeTab === 'description' && (
                  <div className="text-body-md text-stone-600 whitespace-pre-wrap">
                    {product.description || "A masterpiece of textile engineering, crafted from 100% long-staple Giza cotton with hand-applied zari embroidery."}
                  </div>
                )}
                {activeTab === 'material' && (
                  <div className="text-body-md text-stone-600 whitespace-pre-wrap">
                    {product.material_care || "Hand-loomed cotton-silk blend.\nZari and Resham hand embroidery.\nDry clean only."}
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="text-body-md text-stone-600 whitespace-pre-wrap">
                    {product.shipping_info || "Standard shipping takes 3-5 business days.\nInternational shipping takes 7-14 business days.\nReturns accepted within 14 days of delivery."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-section-gap">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-stone-100 pb-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-stone-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-[#D4AF37]">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined">star_half</span>
                </div>
                <span className="text-body-md font-body-md text-stone-500">4.8 (24 reviews)</span>
              </div>
            </div>
            <button className="font-label-caps tracking-widest border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-400 transition-all">WRITE A REVIEW</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-label-caps tracking-widest text-stone-900 uppercase">Ayesha R.</span>
                <span className="text-stone-400 text-xs">2 weeks ago</span>
              </div>
              <div className="flex text-[#D4AF37] text-sm">
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              </div>
              <p className="text-body-md font-body-md italic text-stone-700 leading-relaxed">
                "The fabric quality exceeded my expectations. The hand embroidery is even more delicate in person than it appears in the photos. Truly a piece of heritage."
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-label-caps tracking-widest text-stone-900 uppercase">Hammad K.</span>
                <span className="text-stone-400 text-xs">1 month ago</span>
              </div>
              <div className="flex text-[#D4AF37] text-sm">
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="material-symbols-outlined scale-75">star</span>
              </div>
              <p className="text-body-md font-body-md italic text-stone-700 leading-relaxed">
                "Beautiful craftsmanship. The packaging was also very premium, which made the unboxing experience feel special. Will definitely purchase again."
              </p>
            </div>
          </div>
        </section>

        {/* You May Also Like Section */}
        <section className="mt-section-gap mb-20">
          <h2 className="font-headline-md text-headline-md text-stone-900 mb-12 text-center uppercase tracking-[0.2em]">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} className="group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={p.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBWSJkgOMNQcxB23wGvoZA24-fHWy1miwFy8S-DWusLUW7poLC5blz0X7ZZitQTf7eE6ZyquUmoHsLfyBZU5C0KkKcjS31IH5N1Zh0_Lq4qW6NnAfz_108PkhWrqppHRxKWnTjPysSra4FPowOKPh6PJ8kg3TdtKpV_D1GgdD07oBpxCk8Nq2lgd4Ga1No_hGdIENXcH6uCwEIfsS4oQC9VH43PDJozJSGQVA0f0Mk25jLFrcWYAo9zzg11gg5U5RT7c6Ggjc8AkRIy"} 
                    alt={p.name}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                        navigate('/cart');
                      }} 
                      className="bg-white/90 backdrop-blur px-6 py-2 font-label-caps text-[10px] tracking-widest"
                    >
                      QUICK ADD
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-headline-sm text-body-lg text-stone-900 mb-1">{p.name}</h3>
                  <p className="text-stone-500 font-body-md">Rs. {p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
