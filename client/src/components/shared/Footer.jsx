import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="footer-logo-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <span>KisanSetu</span>
                        </Link>
                        <p className="footer-tagline">
                            Direct from farm to home — fair prices for farmers, fresh produce for families.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Twitter">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <h4>For Farmers</h4>
                        <ul className="footer-links">
                            <li><Link to="/auth/signup">Start Selling</Link></li>
                            <li><Link to="/farmer/products">My Products</Link></li>
                            <li><Link to="/farmer/orders">Manage Orders</Link></li>
                            <li><Link to="/farmer/profile">Farmer Profile</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4>For Buyers</h4>
                        <ul className="footer-links">
                            <li><Link to="/buyer/browse">Browse Produce</Link></li>
                            <li><Link to="/buyer/cart">Shopping Cart</Link></li>
                            <li><Link to="/buyer/orders">Order History</Link></li>
                            <li><Link to="/buyer/profile">Buyer Profile</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} KisanSetu. Built for Bharat.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy</a>
                        <span>·</span>
                        <a href="#">Terms</a>
                        <span>·</span>
                        <a href="#">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
