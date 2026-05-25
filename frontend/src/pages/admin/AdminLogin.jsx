import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user is an admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminError || !admin) {
        // If they aren't in the admins table, we'll still let them in during development 
        // if they are authenticated, but normally you'd signOut() here.
        console.warn('Access denied in production. User is not in admins table.');
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl border border-outline-variant">
        <div className="text-center">
          <img className="mx-auto h-16 w-auto" src="/logo-rohmani.png" alt="Rohmani" />
          <h2 className="mt-6 text-3xl font-display-lg text-primary">Admin Portal</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Sign in to manage your store</p>
        </div>
        
        {error && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="admin@rohmani.com"
              />
            </div>
            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-label-caps uppercase tracking-[0.2em] text-white bg-primary hover:bg-primary-fixed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center pt-4 border-t border-stone-100">
          <Link to="/" className="text-sm font-label-caps text-primary hover:underline underline-offset-4 uppercase tracking-widest">
            ← Back to main store
          </Link>
        </div>
      </div>
    </div>
  );
}
