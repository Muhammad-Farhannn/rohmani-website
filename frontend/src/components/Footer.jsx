import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t-[0.5px] border-stone-200 dark:border-stone-800 bg-[#F5EFE6] dark:bg-stone-900 transition-colors duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 md:px-24 py-20 max-w-screen-2xl mx-auto font-serif text-sm tracking-wide leading-relaxed">
        {/* Brand Column */}
        <div className="flex flex-col items-start space-y-6">
          <Link to="/" className="flex items-center space-x-2 outline-none group">
            <div className="overflow-hidden h-10 md:h-12 w-10 md:w-12 relative">
              <img
                alt="Bird Icon"
                className="absolute left-0 top-0 h-full w-auto max-w-none mix-blend-multiply opacity-90 transition-opacity group-hover:opacity-100"
                src="/logo-rohmani.png"
                style={{ objectPosition: '0% 50%' }}
              />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-['Pinyon_Script'] text-2xl md:text-3xl text-stone-900 dark:text-stone-50">Rohmani</span>
              <span className="font-serif text-[7px] md:text-[8px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">by Bin Arif Textile</span>
            </div>
          </Link>
          <p className="text-stone-500 dark:text-stone-400 max-w-xs">Rohmani Cloth Since 2024
            Slogan: Wear Quality, Wear Confidence.
            Aim: To provide premium ladies and gents stitched & unstitched suits with style, comfort, and trusted quality at affordable prices..</p>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/rohmanitextile?igsh=MXV4b3d0dDM1aGJmbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            <a href="https://www.facebook.com/share/17NwGbeB3R/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://www.tiktok.com/@rohmani.cloth?_r=1&_t=ZS-96f2Odqeofo" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /><path d="M9 12v8" /></svg>
            </a>
          </div>
        </div>
        {/* Links Column 1 */}
        <div className="space-y-4">
          <h4 className="font-label-caps text-xs text-stone-900 dark:text-stone-100 mb-6">Explore</h4>
          <ul className="space-y-3">
            <li><Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors hover:translate-x-1 inline-block duration-300" to="/">About Us</Link></li>
            <li><Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors hover:translate-x-1 inline-block duration-300" to="/">Our Heritage</Link></li>
            <li><Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors hover:translate-x-1 inline-block duration-300" to="/">Sustainability</Link></li>
          </ul>
        </div>
        {/* Links Column 2 */}
        <div className="space-y-4">
          <h4 className="font-label-caps text-xs text-stone-900 dark:text-stone-100 mb-6">Customer Care</h4>
          <ul className="space-y-3">
            <li><Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors hover:translate-x-1 inline-block duration-300" to="/">Shipping & Returns</Link></li>
            <li><Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors hover:translate-x-1 inline-block duration-300 text-[#D4AF37]" to="/">Privacy Policy</Link></li>
            <li><Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors hover:translate-x-1 inline-block duration-300" to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        {/* Contact/Location Column */}
        <div className="space-y-4">
          <h4 className="font-label-caps text-xs text-stone-900 dark:text-stone-100 mb-6">Our Atelier</h4>
          <p className="text-stone-500 dark:text-stone-400 italic">Flagship Store</p>
          <p className="text-stone-500 dark:text-stone-400">House No 198, Motorway valley Sargodha Road, Faisalabad</p>
          <img alt="Map Location" className="w-full h-32 object-cover opacity-60 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1d8oMm2TfOiPuDAxA2m73TjuDqn6X62O9aFHLeADcpE-bXhJnN4KsHqQ96uVzm9_WxvUbLI3I6C85Yg8JpJ17pOt6KLAVrxBW_8bpB5bDDV1OCk6QRjJPJQqgnYycKjAKp3d6Nz3Nzk-99tqJch4uR5PALETo-F_-z5ihmNyp4SrTuyfelxbEtINLCLyhB77X1p4TjsgJuOuUqFjFnKZfuWLMiLhJ-6aCgebPDrWMuZOEabcUVs-u2_zJuuoWIh-xr3HBW5Yaq915" />
        </div>
      </div>
      <div className="border-t border-stone-200 dark:border-stone-800 py-8 px-8 text-center">
        <p className="text-stone-500 dark:text-stone-400 text-xs font-serif tracking-widest uppercase">© 2024 Rohmani By Bin Arif Textiles. Impeccable Craft, Timeless Heritage.</p>
      </div>
    </footer>
  );
}
