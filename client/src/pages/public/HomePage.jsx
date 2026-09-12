import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './HomePage.css';

const AnimatedCounter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

const HomePage = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-bg-pattern" aria-hidden="true"></div>
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-eyebrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                            </svg>
                            Trusted by farmers across Bharat
                        </div>
                        <h1 className="hero-title">
                            Direct from farm
                            <br />
                            <span className="hero-title-accent">to your home</span>
                        </h1>
                        <p className="hero-description">
                            Fair prices for farmers. Fresher produce for families. No middlemen.
                            Connecting Bharat's farms directly to your table.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/auth/signup" className="btn btn-primary btn-lg hero-btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <line x1="19" y1="8" x2="19" y2="14"/>
                                    <line x1="22" y1="11" x2="16" y2="11"/>
                                </svg>
                                Create account
                            </Link>
                            <Link to="/buyer/browse" className="btn btn-secondary btn-lg hero-btn-secondary">
                                Browse produce
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </Link>
                        </div>
                        <div className="hero-trust">
                            <div className="trust-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                                <span>Fresh daily</span>
                            </div>
                            <span className="trust-divider" aria-hidden="true">·</span>
                            <div className="trust-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                <span>Verified farmers</span>
                            </div>
                            <span className="trust-divider" aria-hidden="true">·</span>
                            <div className="trust-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                                <span>Cash or online</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-wrapper">
                            <div className="hero-image-bg"></div>
                            <div className="hero-image-content">
                                <div className="floating-card floating-card-1">
                                    <div className="floating-card-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                            <path d="M2 17l10 5 10-5"/>
                                            <path d="M2 12l10 5 10-5"/>
                                        </svg>
                                    </div>
                                    <div className="floating-card-text">
                                        <span className="floating-card-label">Fresh Produce</span>
                                        <span className="floating-card-value">Direct from farm</span>
                                    </div>
                                </div>
                                <div className="floating-card floating-card-2">
                                    <div className="floating-card-icon floating-card-icon-green">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="1" x2="12" y2="23"/>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                        </svg>
                                    </div>
                                    <div className="floating-card-text">
                                        <span className="floating-card-label">Fair Prices</span>
                                        <span className="floating-card-value">No middlemen</span>
                                    </div>
                                </div>
                                <div className="floating-card floating-card-3">
                                    <div className="floating-card-icon floating-card-icon-gold">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                        </svg>
                                    </div>
                                    <div className="floating-card-text">
                                        <span className="floating-card-label">Community</span>
                                        <span className="floating-card-value">Local trade</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <div className="stat-number">
                                <AnimatedCounter target={500} suffix="+" />
                            </div>
                            <div className="stat-label">Active Farmers</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"/>
                                    <circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                </svg>
                            </div>
                            <div className="stat-number">
                                <AnimatedCounter target={10000} suffix="+" />
                            </div>
                            <div className="stat-label">Happy Buyers</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-gold">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="3" width="15" height="13"/>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/>
                                    <circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                            </div>
                            <div className="stat-number">
                                <AnimatedCounter target={25000} suffix="+" />
                            </div>
                            <div className="stat-label">Orders Delivered</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <div className="stat-number">
                                <AnimatedCounter target={200} suffix="+" />
                            </div>
                            <div className="stat-label">Villages Connected</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <div className="section-header-center">
                        <h2>How KisanSetu Works</h2>
                        <p className="section-subtitle">Simple, transparent, and fair for everyone</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <h3>List Your Produce</h3>
                            <p>Farmers can list their crops in minutes with photos, set their own price, and reach buyers directly.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon feature-icon-blue">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </div>
                            <h3>Browse & Buy</h3>
                            <p>Buy fresh produce from nearby farms, know your farmer, and track every order in real-time.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon feature-icon-gold">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                            <h3>Secure Delivery</h3>
                            <p>Optimized delivery routes ensure your produce reaches fresh. Pay securely online or with cash.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header-center">
                        <h2>What Our Community Says</h2>
                        <p className="section-subtitle">Real stories from farmers and buyers</p>
                    </div>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                    </svg>
                                ))}
                            </div>
                            <p className="testimonial-text">"KisanSetu changed my life. I now sell directly to buyers and earn 40% more than before. No more middlemen taking my hard-earned money."</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">R</div>
                                <div className="testimonial-info">
                                    <span className="testimonial-name">Rajesh Kumar</span>
                                    <span className="testimonial-role">Farmer, Uttar Pradesh</span>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                    </svg>
                                ))}
                            </div>
                            <p className="testimonial-text">"I love knowing exactly where my food comes from. The vegetables are fresher than anything in the supermarket, and I'm supporting local farmers."</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar testimonial-avatar-blue">P</div>
                                <div className="testimonial-info">
                                    <span className="testimonial-name">Priya Sharma</span>
                                    <span className="testimonial-role">Buyer, Delhi</span>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                    </svg>
                                ))}
                            </div>
                            <p className="testimonial-text">"Our village now has a steady income stream. KisanSetu connected us to buyers we never could have reached. It's transformed our community."</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar testimonial-avatar-gold">A</div>
                                <div className="testimonial-info">
                                    <span className="testimonial-name">Anita Devi</span>
                                    <span className="testimonial-role">Farmer, Rajasthan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2>Ready to join the revolution?</h2>
                            <p>Whether you're a farmer looking for fair prices or a buyer seeking fresh produce, KisanSetu is for you.</p>
                            <div className="cta-buttons">
                                <Link to="/auth/signup" className="btn btn-primary btn-lg">
                                    Get started free
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </Link>
                                <Link to="/buyer/browse" className="btn btn-ghost btn-lg cta-ghost-btn">
                                    Browse produce
                                </Link>
                            </div>
                        </div>
                        <div className="cta-visual">
                            <div className="cta-badge">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
