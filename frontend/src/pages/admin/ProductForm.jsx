import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    style: '',
    color: '',
    material: '',
    stock: '',
    featured: false,
    image_url: '',
    gallery_urls: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      const data = response.data;
      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        original_price: data.original_price || '',
        category: data.category || '',
        style: data.style || '',
        color: data.color || '',
        material: data.material || '',
        stock: data.stock || 0,
        featured: data.featured || false,
        image_url: data.image_url || '',
        gallery_urls: data.gallery_urls || []
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Supabase Upload Error Details:', uploadError);
        throw new Error(uploadError.message || 'Unknown storage error');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Full Upload Error:', error);
      alert(`Image upload failed: ${error.message}. Please ensure the "images" bucket exists in your Supabase Storage.`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const config = {
        headers: { Authorization: `Bearer ${session.access_token}` }
      };

      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock) || 0,
        in_stock: (parseInt(formData.stock) || 0) > 0
      };

      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload, config);
        alert('Product updated successfully');
      } else {
        await axios.post('/api/products', payload, config);
        alert('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      const message = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to save product: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-all">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h2 className="text-3xl font-display-md text-primary">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Ivory Serenity Suite"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Description</label>
              <textarea
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                placeholder="Describe the product details, fabric, and craftsmanship..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="24500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Original Price (Discount)</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="32000"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm space-y-6">
            <h3 className="text-lg font-display-md text-primary">Inventory & Categorization</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Artisan Series">Artisan Series</option>
                  <option value="Winter Edition">Winter Edition</option>
                  <option value="Heritage Latha">Heritage Latha</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Style</label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Classic"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Ivory"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Silk"
                />
              </div>
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-primary group-hover:text-primary-fixed transition-colors">Mark as Featured Product</span>
            </label>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm space-y-6">
            <h3 className="text-lg font-display-md text-primary">Product Media</h3>
            
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center overflow-hidden relative group">
                {formData.image_url ? (
                  <>
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs font-label-caps">Change Image</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">image</span>
                    <p className="text-xs text-on-surface-variant font-medium text-center px-4">Upload main product image<br/>(3:4 aspect ratio recommended)</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {uploading && <div className="text-xs text-primary animate-pulse font-medium">Uploading image...</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Manual Image URL (Fallback)</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-lg outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-label-caps text-label-caps uppercase tracking-[0.2em] shadow-lg shadow-primary/30 hover:bg-primary-fixed hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isEdit ? 'Update Product' : 'Publish Product')}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-full py-4 bg-white text-on-surface-variant border border-outline-variant rounded-2xl font-label-caps text-label-caps uppercase tracking-[0.2em] hover:bg-surface-container-low transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
