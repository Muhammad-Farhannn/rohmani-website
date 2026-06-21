import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await getProducts({ limit: 4 });
        setNewArrivals(data);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner Slider */}
        <section className="relative h-[50vh] sm:h-[60vh] md:h-[870px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img className="w-full h-full object-cover" src="/hero-image.png" />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="font-label-caps text-white mb-6 tracking-[0.3em] uppercase">Summer 2026</span>
            <h1 className="font-display-lg text-white mb-10 max-w-3xl leading-tight">Latest Designs Every Week</h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/shop" className="bg-stone-900 text-white px-10 py-4 font-label-caps tracking-widest hover:bg-stone-800 transition-all text-center">Shop Collection</Link>
              <button onClick={() => navigate('/shop')} className="border border-white text-white px-10 py-4 font-label-caps tracking-widest hover:bg-white hover:text-stone-900 transition-all">Explore Lookbook</button>
            </div>
          </div>

        </section>

        {/* Featured Categories Grid */}
        <section className="py-section-gap px-8 md:px-16 max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-on-surface mb-2">Curated Categories</h2>
            <div className="h-[1px] w-24 bg-tertiary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Card 1 */}
            <div className="group relative h-[220px] sm:h-[320px] md:h-[600px] overflow-hidden cursor-pointer" onClick={() => navigate('/shop?category=Unstitched')}>
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="/unstitched-cover.jpg" />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/30 transition-all duration-500"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline-sm mb-4">Unstitched</h3>
                <p className="font-label-caps text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">Shop Premium Fabrics</p>
              </div>
            </div>
            {/* Category Card 2 */}
            <div className="group relative h-[220px] sm:h-[320px] md:h-[600px] overflow-hidden cursor-pointer md:mt-12" onClick={() => navigate('/shop?category=Stitched')}>
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="/stitched-cover.jpg" />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/30 transition-all duration-500"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline-sm mb-4">Stitched</h3>
                <p className="font-label-caps text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">Ready to Wear</p>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-section-gap bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="font-label-caps text-tertiary mb-2 block">Latest Drops</span>
                <h2 className="font-display-lg text-on-surface">New Arrivals</h2>
              </div>
              <Link className="font-label-caps border-b border-stone-800 pb-1 text-on-surface hover:text-tertiary transition-colors" to="/shop">View All Arrivals</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-stone-200 aspect-[3/4] mb-6"></div>
                    <div className="h-4 bg-stone-200 w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-stone-200 w-1/2 mx-auto"></div>
                  </div>
                ))
              ) : (
                newArrivals.map((product) => (
                  <div key={product.id} className="group">
                    <div className="relative overflow-hidden mb-6 aspect-[3/4] cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={product.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBWSJkgOMNQcxB23wGvoZA24-fHWy1miwFy8S-DWusLUW7poLC5blz0X7ZZitQTf7eE6ZyquUmoHsLfyBZU5C0KkKcjS31IH5N1Zh0_Lq4qW6NnAfz_108PkhWrqppHRxKWnTjPysSra4FPowOKPh6PJ8kg3TdtKpV_D1GgdD07oBpxCk8Nq2lgd4Ga1No_hGdIENXcH6uCwEIfsS4oQC9VH43PDJozJSGQVA0f0Mk25jLFrcWYAo9zzg11gg5U5RT7c6Ggjc8AkRIy"}
                        alt={product.name}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="absolute bottom-0 left-0 right-0 bg-stone-900/90 text-white py-4 font-label-caps translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                      >
                        Quick Shop
                      </button>
                    </div>
                    <div className="text-center">
                      <h4 className="font-headline-sm text-lg mb-1">{product.name}</h4>
                      <p className="font-body-md text-stone-500 mb-2">{product.category}</p>
                      <p className="font-label-caps text-stone-900">PKR {product.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="relative h-[320px] sm:h-[420px] md:h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAumYNuUjhfh2pXjzn719Ta2vm1ex04vsFYIDJ2G-KMu-w-N_IBnf2IqR917B6tYIyw9BNp_jdP5Z3w5nZ2FsO580MVTMQ389eWWTYH2wRnVj_k-SNAd4k2zSnxPOdepwsXtnPKzgk89YGp2TKItRIxG0N-MsAcun1vbSqcvdfr0Va0pa8HBOYyIobU0TwuvahLqsijhtYNilwt3bpEaRrDEmd8CqyZMSKL6K98O5UUoecGe8dR_3rjt3oKHCj4FLNZSifhr7qc5sD3" />
            <div className="absolute inset-0 bg-stone-900/40"></div>
          </div>
          <div className="relative z-10 max-w-screen-2xl mx-auto px-8 md:px-16 w-full text-white">
            <div className="max-w-xl p-12 border border-white/20 backdrop-blur-sm bg-black/10">
              <span className="font-label-caps tracking-[0.4em] mb-4 block text-[#D4AF37]">The Artisanal Touch</span>
              <h2 className="font-display-lg mb-6">Impeccable Craft, Timeless Heritage</h2>
              <p className="font-body-lg mb-8 text-stone-200">Discover the soul of Pakistani textiles through our master craftsmen who blend centuries-old techniques with modern design sensibilities.</p>
              <button onClick={() => navigate('/shop')} className="bg-[#D4AF37] text-stone-900 px-10 py-4 font-label-caps tracking-widest hover:bg-stone-100 transition-all">Learn More</button>
            </div>
          </div>
        </section>

        {/* Best Sellers (Bento Layout) */}
        <section className="py-section-gap px-8 md:px-16 max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-on-surface mb-2">Best Sellers</h2>
            <p className="font-body-md text-stone-500">Most beloved pieces by our patrons</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto">
            <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden h-auto md:h-full">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ_XSQFSkCcgC8dxSm_uxKAX-9e98SAwEC9GAoi_ZRCWbjUxzk2GdJFbgLytt_o6FUwpLiYnbndcBGp85isWO2efzETAFgjQkmcgOAzano5H3nzhIIbKnh5-Ut9P0VbOo9BWgSfu210iXW5j1hdlc8JQZWqvKVLO1UIu4Gw8GlpWUe3Tg8lv7lBTG0aAVwk7WJP6SPqI4_DoBtNpPpWWyMP6SRM6v9DTjKa1e4OFRDq7n0U81BkymUZ36mUooXbanrEnHZ_ia_Lfo9" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex flex-col justify-end p-12 text-white">
                <h3 className="font-display-lg text-3xl mb-4">The Royal Velvet Suite</h3>
                <p className="font-body-md mb-6 max-w-md">Our signature velvet collection, perfectly balanced for the festive season.</p>
                <button onClick={() => navigate('/shop')} className="w-fit border-b border-white pb-1 font-label-caps">Shop Now</button>
              </div>
            </div>
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden h-auto md:h-full">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX3CEXt3B1cvz31HZ5s9OaOf6NOtyzfc-g36foUMLRMhwFsqtbLt0xU-Rzf3ulxTdEkTYJLLelWf4YyVDwFG6cEH2_HeUW97bMSqJdfoHI9MbCcKZMTi1EodLeBCJwCRuO6GCjl0Yb5RBrNyfAxgiy7wnbdJr1bygP15WUKlM1nD0vY-08SJceqXG7PoTImJgbDZdqPsS-zAOkqTEyz9C8OusaBVqMtBNnIj5XCAPFJx6zmrKPJ4wGb8qLK-YFXPqNimnzdgTJun5p" />
              <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-all duration-500 flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline-sm text-lg">Linen Essentials</h3>
                <button onClick={() => navigate('/shop')} className="w-fit border-b border-white pb-1 font-label-caps mt-2 text-xs">View Collection</button>
              </div>
            </div>
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden h-auto md:h-full">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIGlQKXl7a8tXGhDOemH7HK9aQzJRSEmbZhHTxghewFQP0-6_pGrNLVyq2-zfBD-kVQy_F6vn9XDLPmTNV6PivhSVg8KhGDuy0g00bsTHGSzTeoPmMvjqvqxSxV46w1T8wKnkypltNM5sY9vyvQ9UKYhA9DevgZQgMYXNQgX_0eBY-zBJK-b0_NHwIVvUrYgjqUggQbkM23M70_bQi6hnOIlg8CqHNRvDOyWll8wkpnZuLBCFABnI0C3-bUYMwV7H4gMIN9oAdq_lb" />
              <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-all duration-500 flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline-sm text-lg">Seasonal Prints</h3>
                <button onClick={() => navigate('/shop')} className="w-fit border-b border-white pb-1 font-label-caps mt-2 text-xs">View Collection</button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-24 bg-secondary-fixed">
          <div className="max-w-2xl mx-auto text-center px-8">
            <span className="font-label-caps text-on-secondary-fixed mb-4 block">The Rohmani Journal</span>
            <h2 className="font-display-lg text-on-surface mb-6">Join Our Inner Circle</h2>
            <p className="font-body-md text-on-secondary-fixed-variant mb-10">Be the first to know about our exclusive launches, heritage stories, and private sales. Experience quiet luxury in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-grow bg-transparent border-b border-stone-400 py-3 focus:border-stone-900 transition-colors focus:ring-0 text-stone-900 placeholder-stone-500" placeholder="Your Email Address" type="email" />
              <button className="bg-stone-900 text-white px-12 py-3 font-label-caps tracking-widest hover:bg-stone-800 transition-all">Subscribe</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
