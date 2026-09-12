import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import Toast, { useToast } from '../../components/shared/Toast.jsx';
import './Buyer.css';

const CATEGORIES = [
    { name: 'All', icon: 'M4 6h16M4 12h16M4 18h16' },
    { name: 'Vegetables', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z' },
    { name: 'Fruits', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
    { name: 'Grains', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
    { name: 'Dairy', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
    { name: 'Organic', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
    { name: 'Other', icon: 'M12 2L2 7l10 5 10-5-10-5z' }
];

const BrowseProducts = () => {
    const { products, filteredProducts, loading, fetchProducts, updateFilters, filters } = useProducts();
    const { addToCart } = useCart();
    const { toasts, success, error } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        updateFilters({ search: e.target.value });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        updateFilters({ category: category === 'All' ? '' : category });
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product, 1);
            success(`${product.productName} added to cart!`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add to cart';
            error(msg);
        }
    };

    if (loading) return <LoadingSpinner text="Loading products..." />;

    return (
        <div className="browse-page">
            <Toast toasts={toasts} />
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Browse produce</h1>
                        <p className="page-subtitle">{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available</p>
                    </div>
                </div>

                <div className="browse-filters">
                    <div className="search-box">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input type="text" placeholder="Search by product name..." className="form-input"
                            value={searchTerm} onChange={handleSearch} aria-label="Search products" />
                    </div>
                    <div className="category-tabs" role="tablist" aria-label="Filter by category">
                        {CATEGORIES.map(cat => (
                            <button key={cat.name} onClick={() => handleCategoryChange(cat.name)}
                                className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`} role="tab" aria-selected={selectedCategory === cat.name}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={cat.icon}/>
                                </svg>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                <line x1="8" y1="11" x2="14" y2="11"/>
                            </svg>
                        </div>
                        <h3>No products found</h3>
                        <p>Try a different search or category</p>
                    </div>
                ) : (
                    <div className="products-grid grid grid-4">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="product-card card">
                                <div className="product-image-wrapper">
                                    <Link to={`/buyer/product/${product._id}`}>
                                        <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'}
                                            alt={product.productName} className="product-image" loading="lazy" />
                                    </Link>
                                    <div className="product-badge-overlay">
                                        <span className="badge badge-primary">{product.category}</span>
                                    </div>
                                    <button className="product-quick-view" aria-label="Quick view">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="product-content">
                                    <Link to={`/buyer/product/${product._id}`}>
                                        <h3 className="product-name">{product.productName}</h3>
                                    </Link>
                                    <p className="product-farmer">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        {product.ownerName || 'Farmer'}
                                    </p>
                                    <p className="product-location">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        {product.city}, {product.state}
                                    </p>
                                    <div className="product-footer">
                                        <div className="product-price">
                                            ₹{product.price}
                                            <span className="product-price-unit">/kg</span>
                                        </div>
                                        <div className={`product-stock ${product.currentQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.currentQuantity > 0 ? `${product.currentQuantity} kg` : 'Out of stock'}
                                        </div>
                                    </div>
                                    <button onClick={() => handleAddToCart(product)}
                                        className="btn btn-primary btn-full" disabled={product.currentQuantity === 0}>
                                        {product.currentQuantity > 0 ? 'Add to cart' : 'Out of stock'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProducts;
