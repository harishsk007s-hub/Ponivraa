import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Search,
  X,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { Product, ProductCategory, HoneyWeight, ProductVariant } from '../../types';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

// Strictly Mango, Honey, Guava (Apple and Orange removed)
const CATEGORIES: ProductCategory[] = ['Mango', 'Honey', 'Guava'];
const HONEY_WEIGHTS: HoneyWeight[] = ['250 g', '350 g', '500 g', '1 kg'];

export const AdminProducts: React.FC = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mango' as ProductCategory,
    price: '',
    description: '',
    image: '',
    stockQuantity: '',
    inStock: true,
    isVisible: true,
  });

  // Honey variants form state
  const [honeyVariants, setHoneyVariants] = useState<
    Array<{ weight: HoneyWeight; price: string; stockQuantity: string }>
  >([
    { weight: '250 g', price: '240', stockQuantity: '20' },
    { weight: '350 g', price: '320', stockQuantity: '15' },
    { weight: '500 g', price: '450', stockQuantity: '20' },
    { weight: '1 kg', price: '850', stockQuantity: '10' },
  ]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load products (including hidden ones for admin)
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts(undefined, undefined, true);
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Mango',
      price: '',
      description: '',
      image: '',
      stockQuantity: '20',
      inStock: true,
      isVisible: true,
    });
    setHoneyVariants([
      { weight: '250 g', price: '240', stockQuantity: '20' },
      { weight: '350 g', price: '320', stockQuantity: '15' },
      { weight: '500 g', price: '450', stockQuantity: '20' },
      { weight: '1 kg', price: '850', stockQuantity: '10' },
    ]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description,
      image: product.image,
      stockQuantity: String(product.stockQuantity),
      inStock: product.inStock,
      isVisible: product.isVisible,
    });

    if (product.category === 'Honey' && product.variants && product.variants.length > 0) {
      setHoneyVariants(
        HONEY_WEIGHTS.map((w) => {
          const match = product.variants?.find((v) => v.weight === w);
          return {
            weight: w,
            price: match ? String(match.price) : '250',
            stockQuantity: match ? String(match.stockQuantity) : '10',
          };
        })
      );
    } else {
      setHoneyVariants([
        { weight: '250 g', price: '240', stockQuantity: '20' },
        { weight: '350 g', price: '320', stockQuantity: '15' },
        { weight: '500 g', price: '450', stockQuantity: '20' },
        { weight: '1 kg', price: '850', stockQuantity: '10' },
      ]);
    }

    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setFormError(null);
      const uploadedUrl = await api.uploadImage(file, token || undefined);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: any) {
      console.error('Upload failed:', err);
      setFormError(err.message || 'Image upload failed. You can paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Please enter a product name');
      return;
    }

    if (!formData.image.trim()) {
      setFormError('Please provide a product image URL or upload an image file');
      return;
    }

    try {
      setFormSubmitting(true);

      let payload: any = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim(),
        isVisible: formData.isVisible,
      };

      if (formData.category === 'Honey') {
        const formattedVariants = honeyVariants.map((v) => ({
          weight: v.weight,
          price: Number(v.price) || 0,
          stockQuantity: Number(v.stockQuantity) || 0,
          inStock: Number(v.stockQuantity) > 0,
        }));

        const totalStock = formattedVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
        payload.variants = formattedVariants;
        payload.stockQuantity = totalStock;
        payload.price = formattedVariants[0] ? formattedVariants[0].price : 200;
        payload.inStock = totalStock > 0;
      } else {
        const priceNum = Number(formData.price);
        const stockNum = Number(formData.stockQuantity);

        if (isNaN(priceNum) || priceNum < 0) {
          setFormError('Please enter a valid price per kg');
          setFormSubmitting(false);
          return;
        }

        if (isNaN(stockNum) || stockNum < 0) {
          setFormError('Please enter a valid stock quantity');
          setFormSubmitting(false);
          return;
        }

        payload.price = priceNum;
        payload.stockQuantity = stockNum;
        payload.inStock = stockNum > 0 ? formData.inStock : false;
      }

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload, token || undefined);
      } else {
        await api.createProduct(payload, token || undefined);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      console.error('Save product error:', err);
      setFormError(err.message || 'Failed to save product');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.deleteProduct(id, token || undefined);
      loadProducts();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-darktext">
            Produce Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage fruit pricing, honey weight variants, stock levels, and storefront visibility
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-colors text-xs font-semibold shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Produce / Honey</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar: strictly Mango, Honey, Guava */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-700 text-xs font-bold">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p>No products match your search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Crop / Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pricing / Variants</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProducts.map((p) => {
                  const isHoney = p.category === 'Honey';
                  const isAvailable = p.inStock && p.stockQuantity > 0;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-darktext block">{p.name}</span>
                            <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                              {p.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-lightgreen text-primary font-bold px-2 py-0.5 rounded text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      {/* Pricing column: shows variants breakdown if honey */}
                      <td className="py-3 px-4">
                        {isHoney && p.variants && p.variants.length > 0 ? (
                          <div className="space-y-0.5 text-[10px] text-gray-600">
                            {p.variants.map((v) => (
                              <span key={v.weight} className="inline-block mr-2 font-semibold">
                                {v.weight}: <strong className="text-accent">₹{v.price}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-extrabold text-accent text-sm">
                            ₹{p.price} / kg
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-darktext">
                        {p.stockQuantity} {isHoney ? 'jars' : 'kg'}
                      </td>

                      <td className="py-3 px-4">
                        {isAvailable ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px]">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[10px]">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.isVisible ? (
                          <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-lightgreen transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-darktext/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="font-serif text-xl font-bold text-darktext">
                {editingProduct ? 'Edit Produce / Honey' : 'Add New Produce to Catalog'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Produce / Honey Variety Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Gulkand Honey or Totapuri Mango"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as ProductCategory })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-white font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* If Category is Honey: Show 4 Weight Variants Inputs */}
              {formData.category === 'Honey' ? (
                <div className="p-4 bg-cream rounded-2xl border border-gray-200 space-y-3">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Honey Weight Variants Pricing & Stock:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {honeyVariants.map((v, idx) => (
                      <div key={v.weight} className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                        <span className="font-bold text-xs text-primary block">{v.weight} Variant</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-500 block uppercase">Price (₹)</label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={v.price}
                              onChange={(e) => {
                                const updated = [...honeyVariants];
                                updated[idx].price = e.target.value;
                                setHoneyVariants(updated);
                              }}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 block uppercase">Stock (Jars)</label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={v.stockQuantity}
                              onChange={(e) => {
                                const updated = [...honeyVariants];
                                updated[idx].stockQuantity = e.target.value;
                                setHoneyVariants(updated);
                              }}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Mango / Guava Price & Stock */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Price per kg (in ₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 320"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Stock Quantity (in kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 45"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe farm origin, harvest notes, flavor profile..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              {/* Image Input & Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Produce Image (URL or Upload) *
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    required
                    placeholder="Paste image URL (e.g. Unsplash URL)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />

                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Or upload image file'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.image && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-8 h-8 rounded object-cover border border-gray-200"
                        />
                        <span className="text-[10px] text-emerald-700 font-semibold">Preview loaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-darktext">In Stock Status</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-darktext">Visible on Public Store</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? 'Saving...' : editingProduct ? 'Update Produce' : 'Save Produce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
