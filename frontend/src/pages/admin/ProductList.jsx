import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const response = await axios.get('/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 md:p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-48 px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option value="">All Categories</option>
            <option value="Artisan Series">Artisan Series</option>
            <option value="Winter Edition">Winter Edition</option>
            <option value="Heritage Latha">Heritage Latha</option>
          </select>
          <Link
            to="/admin/products/new"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-label-caps text-sm hover:bg-primary-fixed transition-all shadow-md shadow-primary/20 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Product
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center">Loading products...</td></tr>
              ) : products.length > 0 ? products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant flex-shrink-0">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{product.name}</p>
                        <p className="text-xs text-on-surface-variant">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{product.category}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-primary">PKR {product.price}</p>
                    {product.original_price && (
                      <p className="text-xs text-on-surface-variant line-through">PKR {product.original_price}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-label-caps uppercase tracking-wider ${
                      product.stock > 10 ? 'bg-green-100 text-green-700' : 
                      product.stock > 0 ? 'bg-orange-100 text-orange-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-on-surface-variant">No products found matching your criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
