import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await signIn({ email, password });
      if (authError) throw authError;

      if (isAdminLogin) {
        // Check if user exists in admins table
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (adminError || !admin) {
          await supabase.auth.signOut();
          throw new Error('You are not authorized as admin');
        }
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section (Left side on Desktop) */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary-container">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrK-ZMz0knwR_yprdnCXWsyc-AET37RNPtaragRYAUKz3SVLxFVUw2VI-uul-Y5uC1EufuBsk4w1R-gqy7oWZyim_xJlHaoR0vTRGcuqeaghAw7XZ7O5iHUtLxTBnU87Um9QfQOghcUsLMHQ8PLFg65wnRtITHz1D0Bwcd-1ywiFhDkHWnrUHTngqnXvE9tNnKCp93Cw70BnZJlk7iaLiaq_PMesB_wN9ScKeS8ikfv5Gi33jDjiLXoKB39EmH5pXchm2ClCEEU4h1"/>
        </div>
        <div className="absolute inset-0 bg-stone-900/10 z-10"></div>
        <div className="relative z-20 flex flex-col justify-end p-margin-edge w-full">
          <h1 className="font-display-lg text-display-lg text-white mb-unit-sm">Timeless Heritage.</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-md">Experience the meticulous artistry of Pakistani craftsmanship, reimagined for the modern aesthetic.</p>
        </div>
      </section>
      {/* Form Section (Right side) */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center bg-surface px-unit-lg py-section-gap">
        <div className="w-full max-w-md space-y-unit-lg">
          {/* Brand Header */}
          <div className="text-center md:text-left space-y-unit-xs">
            <Link className="flex flex-col items-center md:items-start group" to="/">
              <img alt="Rohmani Cloth Logo" className="h-28 w-auto mb-2 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" src="/logo-rohmani.png"/>
            </Link>
          </div>
          <div className="space-y-unit-xs text-center md:text-left">
            <h2 className="font-headline-md text-headline-md text-on-surface">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Access your exclusive collection and orders.</p>
          </div>

          {/* User/Admin Toggle */}
          <div className="flex p-1 bg-surface-container-low border border-outline-variant rounded-lg">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`flex-1 py-2 text-xs font-label-caps uppercase tracking-wider rounded-md transition-all ${!isAdminLogin ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              User Login
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`flex-1 py-2 text-xs font-label-caps uppercase tracking-wider rounded-md transition-all ${isAdminLogin ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Admin Login
            </button>
          </div>

          {error && (
            <div className="p-4 bg-error/10 text-error text-sm font-body-md border border-error/20">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-unit-xs">
                <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="email">Email Address</label>
                <input 
                  className="w-full px-0 py-3 bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors font-body-md text-on-surface placeholder:text-outline-variant" 
                  id="email" 
                  name="email" 
                  placeholder="name@example.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-unit-xs">
                <div className="flex justify-between items-center">
                  <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="password">Password</label>
                  <Link className="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors" to="#">Forgot Password?</Link>
                </div>
                <input 
                  className="w-full px-0 py-3 bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors font-body-md text-on-surface placeholder:text-outline-variant" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <button 
                disabled={loading}
                className="block text-center w-full py-4 bg-primary text-white font-label-caps text-label-caps uppercase tracking-[0.2em] hover:bg-on-surface transition-all duration-500 shadow-sm disabled:opacity-50" 
                type="submit"
              >
                {loading ? 'Authenticating...' : `Login as ${isAdminLogin ? 'Admin' : 'User'}`}
              </button>
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink mx-4 font-label-caps text-label-caps text-outline-variant uppercase">Or</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>
              <button 
                type="button"
                onClick={handleGoogleLogin} 
                className="w-full py-4 border border-outline-variant bg-white flex items-center justify-center gap-unit-md hover:bg-surface-container-low transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.03-.03.03-.03.04-.04z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">Continue with Google</span>
              </button>
            </div>
          </form>
          <div className="pt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account? 
              <Link className="text-primary font-semibold hover:underline transition-all ml-1" to="/signup">Sign Up</Link>
            </p>
          </div>
          {/* Footer Links */}
          <div className="pt-12 flex justify-center gap-6 border-t border-outline-variant/30">
            <Link className="font-label-caps text-[10px] text-outline hover:text-on-surface transition-colors uppercase tracking-widest" to="#">Privacy Policy</Link>
            <Link className="font-label-caps text-[10px] text-outline hover:text-on-surface transition-colors uppercase tracking-widest" to="#">Terms of Service</Link>
            <Link className="font-label-caps text-[10px] text-outline hover:text-on-surface transition-colors uppercase tracking-widest" to="#">Support</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

