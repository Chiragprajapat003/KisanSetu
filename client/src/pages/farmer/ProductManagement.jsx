import { useState, useEffect } from 'react';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../../services/product.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import Toast, { useToast } from '../../components/shared/Toast.jsx';
import './Farmer.css';
import './ResponsiveFixes.css';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic', 'Other'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        productName: '', description: '', category: 'Vegetables',
        quantity: '', price: '', image: ''
    });
    const { toasts, success, error } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getMyProducts();
            setProducts(response.data.products || []);
        } catch (err) {
            error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ productName: '', description: '', category: 'Vegetables', quantity: '', price: '', image: '' });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.productName,
            description: product.description,
            category: product.category,
            quantity: product.currentQuantity,
            price: product.price,
            image: product.image || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                quantity: Number(formData.quantity),
                price: Number(formData.price)
            };
            if (editingProduct) {
                await updateProduct(editingProduct._id, data);
                success('Product updated successfully!');
            } else {
                await createProduct(data);
                success('Product created successfully!');
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            success('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            error('Failed to delete product');
        }
    };

    if (loading) return <LoadingSpinner text="Loading products..." />;

    return (
        <div className="products-page">
            <Toast toasts={toasts} />
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My products</h1>
                        <p className="page-subtitle">{products.length === 0 ? 'Add your first crop to start selling' : `${products.length} ${products.length === 1 ? 'product' : 'products'} live`}</p>
                    </div>
                    <button onClick={openAddModal} className="btn btn-primary">Add product</button>
                </div>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--color-bg-soft)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.2rem' }} aria-hidden="true">—</div>
                        <h3>No products yet</h3>
                        <p>Add your harvest with a photo, quantity, and price — buyers nearby will see it.</p>
                        <button onClick={openAddModal} className="btn btn-primary">Add your first product</button>
                    </div>
                ) : (
                    <div className="products-grid grid grid-3">
                        {products.map(product => (
                            <div key={product._id} className="product-card card">
                                <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'}
                                    alt={product.productName} className="product-image" />
                                <div className="product-content">
                                    <span className="badge badge-primary">{product.category}</span>
                                    <h3 className="product-name">{product.productName}</h3>
                                    <p className="product-desc">{product.description}</p>
                                    <div className="product-stats">
                                        <span>{product.currentQuantity} kg available</span>
                                        <span className="product-price">₹{product.price}/kg</span>
                                    </div>
                                    <div className="product-actions">
                                        <button onClick={() => openEditModal(product)} className="btn btn-secondary btn-sm">Edit</button>
                                        <button onClick={() => handleDelete(product._id)} className="btn btn-outline-danger btn-sm">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal modal-fixed" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <div>
                                    <h2>{editingProduct ? 'Edit product' : 'Add product'}</h2>
                                    <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '4px' }}>{editingProduct ? 'Update quantity, price or photo' : 'Add what you are harvesting today'}</p>
                                </div>
                                <button className="close-btn" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>What are you selling? <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                        <input type="text" name="productName" value={formData.productName}
                                            onChange={handleChange} className="form-input" required placeholder="e.g. Tomatoes, Wheat" />
                                    </div>
                                    <div className="form-group">
                                        <label>Describe it</label>
                                        <textarea name="description" value={formData.description}
                                            onChange={handleChange} className="form-input" rows="3" required placeholder="Variety, freshness, harvest date" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Quantity (kg) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                            <input type="number" name="quantity" value={formData.quantity}
                                                onChange={handleChange} className="form-input" required min="1" placeholder="e.g. 50" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Price — ₹ per kg <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                        <input type="number" name="price" value={formData.price}
                                            onChange={handleChange} className="form-input" required min="1"
                                            placeholder="e.g. 40" />
                                    </div>
                                    <div className="form-group">
                                        <label>Add a photo</label>
                                        <div className="image-input-container" style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-border-light)', borderRadius: '10px', padding: '12px' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-upload"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            error('Image size must be less than 2MB');
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData(prev => ({ ...prev, image: reader.result }));
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="file-input-hidden"
                                                style={{ display: 'none' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <label htmlFor="file-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginBottom: 0 }}>
                                                    Choose photo
                                                </label>
                                                <span className="text-muted" style={{ fontSize: '0.78rem' }}>Max 2MB · JPG or PNG</span>
                                                <button type="button" onClick={() => {
                                                    const url = prompt("Enter image URL:");
                                                    if (url) setFormData(prev => ({ ...prev, image: url }));
                                                }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}>or paste URL</button>
                                            </div>

                                            {formData.image && (
                                                <div className="image-preview" style={{ marginTop: '12px', position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#fff' }}>
                                                    <img src={formData.image} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
                                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="btn btn-secondary btn-sm" style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px 10px' }}>Remove</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingProduct ? 'Save changes' : 'Publish product'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
