import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const location = useLocation();

  const getLinkClass = (path, searchParam = '') => {
    let isActive = false;
    if (path === '/shop') {
      if (searchParam) {
        isActive = location.pathname === '/shop' && location.search.includes(searchParam);
      } else {
        isActive = location.pathname === '/shop' && !location.search;
      }
    } else {
      isActive = location.pathname === path;
    }

    return `transition-all duration-500 pb-1 ${
      isActive 
        ? 'text-stone-900 dark:text-stone-50 border-b border-[#D4AF37]' 
        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
    }`;
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#FCF9F6]/95 dark:bg-stone-950/95 backdrop-blur-sm border-b-[0.5px] border-stone-200 dark:border-stone-800 shadow-sm shadow-stone-200/10 dark:shadow-none transition-all duration-500">
        <nav className="flex justify-between items-center w-full px-3 sm:px-6 md:px-16 py-3 md:py-6 max-w-[1440px] mx-auto">
          {/* Mobile Menu Button (Left) */}
          <button 
            className="md:hidden flex items-center text-stone-800 dark:text-stone-100 p-1"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="material-symbols-outlined" style={{fontSize: '22px'}}>menu</span>
          </button>

          {/* Navigation Links (Left - Desktop) */}
          <div className="hidden md:flex items-center space-x-8 font-serif tracking-widest uppercase text-xs md:text-sm">
            <Link className={getLinkClass('/')} to="/">Home</Link>
            <Link className={getLinkClass('/shop', 'Newest')} to="/shop?sort=Newest Arrivals">New Arrivals</Link>
            <Link className={getLinkClass('/shop')} to="/shop">Collections</Link>
          </div>

          {/* Search Bar Overlay */}
          {isSearchOpen && (
            <div className="absolute inset-0 bg-[#FCF9F6] dark:bg-stone-950 z-50 flex items-center px-4 md:px-16 animate-fade-in">
              <form onSubmit={handleSearch} className="flex-grow flex items-center">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="SEARCH COLLECTIONS..." 
                  className="w-full bg-transparent border-none focus:ring-0 font-serif tracking-[0.1em] md:tracking-[0.2em] text-sm md:text-lg uppercase"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="ml-2 md:ml-4">
                  <span className="material-symbols-outlined text-stone-900 dark:text-stone-50" style={{fontSize: '20px'}}>search</span>
                </button>
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-4 md:ml-8">
                  <span className="material-symbols-outlined text-stone-400" style={{fontSize: '20px'}}>close</span>
                </button>
              </form>
            </div>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center justify-center outline-none group py-2">
            <div className="h-16 sm:h-20 md:h-28 w-auto flex-shrink-0">
              <img 
                alt="Rohmani Logo" 
                className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                src="/logo-rohmani.png"
              />
            </div>
          </Link>

          {/* Trailing Icons (Right) */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6 text-stone-800 dark:text-stone-100">
            <div className="hidden md:flex items-center space-x-6 font-serif tracking-widest uppercase text-xs">
              <Link className={getLinkClass('/shop', 'Sale')} to="/shop?category=Sale">Sale</Link>
              <Link className={getLinkClass('/contact')} to="/contact">Contact</Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-70 transition-opacity duration-300 p-1">
                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>search</span>
              </button>
              <NavLink to={user ? "/dashboard" : "/login"} className={({ isActive }) => `hover:opacity-70 transition-opacity duration-300 p-1 ${isActive ? 'text-stone-900 dark:text-stone-50' : ''}`}>
                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>person</span>
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => `hover:opacity-70 transition-opacity duration-300 relative block p-1 ${isActive ? 'text-stone-900 dark:text-stone-50' : ''}`}>
                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>shopping_bag</span>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        getLinkClass={getLinkClass} 
      />
    </>
  );

}

{/* Mobile Menu Overlay */}
const MobileMenu = ({ isOpen, onClose, getLinkClass }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Menu Content */}
      <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#FCF9F6] dark:bg-stone-950 shadow-2xl animate-slide-in-left p-8 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <span className="font-serif tracking-widest uppercase text-xs text-stone-400">Navigation</span>
          <button onClick={onClose} className="p-2">
            <span className="material-symbols-outlined text-stone-500">close</span>
          </button>
        </div>
        
        <nav className="flex flex-col space-y-8 font-serif tracking-[0.2em] uppercase text-sm">
          <Link onClick={onClose} className={getLinkClass('/')} to="/">Home</Link>
          <Link onClick={onClose} className={getLinkClass('/shop', 'Newest')} to="/shop?sort=Newest Arrivals">New Arrivals</Link>
          <Link onClick={onClose} className={getLinkClass('/shop')} to="/shop">Collections</Link>
          <Link onClick={onClose} className={getLinkClass('/shop', 'Sale')} to="/shop?category=Sale">Sale</Link>
          <Link onClick={onClose} className={getLinkClass('/contact')} to="/contact">Contact</Link>
        </nav>

        <div className="mt-auto pt-8 border-t border-stone-200 dark:border-stone-800">
          <p className="text-[10px] text-stone-400 font-serif tracking-widest uppercase">
            &copy; {new Date().getFullYear()} ROHMANI BY BIN ARIF
          </p>
        </div>
      </div>
    </div>
  );
};

