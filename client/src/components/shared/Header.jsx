import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useSocket } from '../../hooks/useSocket';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const { unreadCount, pendingOrderCount } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <span className="logo-text">KisanSetu</span>
                </Link>

                <button 
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    )}
                </button>

                <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'farmer' ? (
                                <>
                                    <Link 
                                        to="/farmer/products" 
                                        className={`nav-link ${isActive('/farmer/products') ? 'nav-link-active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                        My Products
                                    </Link>
                                    <div className="nav-item-wrapper">
                                        <Link 
                                            to="/farmer/orders" 
                                            className={`nav-link ${isActive('/farmer/orders') ? 'nav-link-active' : ''}`}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                <polyline points="14 2 14 8 20 8"/>
                                                <line x1="16" y1="13" x2="8" y2="13"/>
                                                <line x1="16" y1="17" x2="8" y2="17"/>
                                                <polyline points="10 9 9 9 8 9"/>
                                            </svg>
                                            Orders
                                        </Link>
                                        {pendingOrderCount > 0 && <span className="nav-badge">{pendingOrderCount}</span>}
                                    </div>
                                    <div className="nav-item-wrapper">
                                        <Link 
                                            to="/farmer/messages" 
                                            className={`nav-link ${isActive('/farmer/messages') ? 'nav-link-active' : ''}`}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                            </svg>
                                            Messages
                                        </Link>
                                        {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/buyer/browse" 
                                        className={`nav-link ${isActive('/buyer/browse') ? 'nav-link-active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"/>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                        </svg>
                                        Browse
                                    </Link>
                                    <div className="nav-item-wrapper">
                                        <Link 
                                            to="/buyer/messages" 
                                            className={`nav-link ${isActive('/buyer/messages') ? 'nav-link-active' : ''}`}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                            </svg>
                                            Messages
                                        </Link>
                                        {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                                    </div>
                                    <Link 
                                        to="/buyer/cart" 
                                        className={`nav-link cart-link ${isActive('/buyer/cart') ? 'nav-link-active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1"/>
                                            <circle cx="20" cy="21" r="1"/>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                        </svg>
                                        Cart
                                        {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
                                    </Link>
                                </>
                            )}

                            <div className="profile-dropdown" ref={dropdownRef}>
                                <button
                                    className="profile-btn"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span className="profile-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                    <span className="profile-name">{user?.name}</span>
                                    <svg className={`dropdown-arrow ${dropdownOpen ? 'dropdown-arrow-open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        {user?.role === 'buyer' ? (
                                            <>
                                                <Link
                                                    to="/buyer/profile"
                                                    className="dropdown-item"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                        <circle cx="12" cy="7" r="4"/>
                                                    </svg>
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/buyer/orders"
                                                    className="dropdown-item"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                        <polyline points="14 2 14 8 20 8"/>
                                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                                    </svg>
                                                    Order History
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/farmer/dashboard"
                                                    className="dropdown-item"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="7" height="7"/>
                                                        <rect x="14" y="3" width="7" height="7"/>
                                                        <rect x="14" y="14" width="7" height="7"/>
                                                        <rect x="3" y="14" width="7" height="7"/>
                                                    </svg>
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/farmer/profile"
                                                    className="dropdown-item"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                        <circle cx="12" cy="7" r="4"/>
                                                    </svg>
                                                    My Profile
                                                </Link>
                                            </>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item dropdown-logout"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/auth/login" className="btn btn-secondary">Login</Link>
                            <Link to="/auth/signup" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
