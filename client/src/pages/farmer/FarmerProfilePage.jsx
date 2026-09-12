import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../../components/shared/LocationPicker';
import KYCSection from './KYCSection';
import './Farmer.css';

const FarmerProfilePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phno: '',
        city: '',
        state: '',
        pin: '',
        upiId: '',
        location: { type: 'Point', coordinates: [], address: '' }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/farmers/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setProfile(data.farmer);
                    setFormData({
                        name: data.farmer.name || '',
                        email: data.farmer.email || '',
                        phno: data.farmer.phno || '',
                        city: data.farmer.city || '',
                        state: data.farmer.state || '',
                        pin: data.farmer.pin || '',
                        upiId: data.farmer.upiId || '',
                        location: data.farmer.location || { type: 'Point', coordinates: [], address: '' }
                    });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLocationChange = (location) => {
        setFormData(prev => ({
            ...prev,
            location: { type: 'Point', ...location }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/farmers/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Profile updated!' });
                setProfile(data.farmer);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/farmers/account', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                logout();
                navigate('/');
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to delete account' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete account' });
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="farmer-profile-page">
            <div className="container">
                <h1 className="page-title" style={{ marginBottom: '4px' }}>Farm profile</h1>
                <p className="page-subtitle">Update your farm details and location</p>

                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                        <h3>Farm Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Farm/Owner Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" name="phno" value={formData.phno} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>PIN Code</label>
                                <input type="text" name="pin" value={formData.pin} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>UPI ID (for receiving payments)</label>
                                <input
                                    type="text"
                                    name="upiId"
                                    value={formData.upiId}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="yourname@upi or yourname@paytm"
                                />
                                <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                                    Enter your UPI ID to receive direct payments via QR code
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Farm location</h3>
                        <p className="text-muted" style={{ marginBottom: '12px' }}>Set your exact farm location for accurate deliveries.</p>

                        {formData.location?.address && (
                            <div style={{ background: 'var(--color-success-light)', padding: '12px 14px', borderRadius: '10px', marginBottom: '12px', border: '1px solid #C8D8CA', borderLeft: '3px solid var(--color-primary)' }}>
                                <strong style={{ fontSize: '0.85rem' }}>Current location:</strong> <span style={{ fontSize: '0.85rem' }}>{formData.location.address}</span>
                                {formData.location?.coordinates?.length === 2 && (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                        {formData.location.coordinates[1].toFixed(5)}, {formData.location.coordinates[0].toFixed(5)}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowLocationModal(true)}
                            className="btn btn-secondary"
                        >
                            {formData.location?.address ? 'Update location' : 'Set location'}
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '12px' }}>
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </form>

                <KYCSection farmerId={profile?._id} />

                <div style={{ marginTop: '20px', padding: '16px', background: 'var(--color-danger-light)', border: '1px solid #E8C4C4', borderRadius: '12px' }}>
                    <h3 style={{ color: 'var(--color-danger)', fontSize: '0.95rem', marginBottom: '6px' }}>Danger zone</h3>
                    <p style={{ color: '#7A2525', marginBottom: '12px', fontSize: '0.85rem', lineHeight: 1.4 }}>Deleting your account will permanently remove your products and orders.</p>
                    <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-outline-danger btn-sm">
                        Delete account
                    </button>
                </div>

                {showDeleteConfirm && (
                    <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 style={{ color: 'var(--color-danger)' }}>Delete account?</h2>
                                <button className="close-btn" onClick={() => setShowDeleteConfirm(false)} aria-label="Close">&times;</button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>All products and orders will be permanently removed. This cannot be undone.</p>
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary" disabled={deleting}>Cancel</button>
                                <button onClick={handleDeleteAccount} className="btn btn-danger" disabled={deleting}>
                                    {deleting ? 'Deleting…' : 'Delete account'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showLocationModal && (
                    <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
                        <div className="modal" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Update farm location</h2>
                                <button className="close-btn" onClick={() => setShowLocationModal(false)} aria-label="Close">&times;</button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted" style={{ marginBottom: '12px', fontSize: '0.875rem' }}>
                                    Pin your exact farm location for accurate pickups.
                                </p>
                            <LocationPicker
                                value={formData.location}
                                onChange={handleLocationChange}
                            />
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowLocationModal(false)} className="btn btn-secondary">Cancel</button>
                                <button onClick={() => setShowLocationModal(false)} className="btn btn-primary">Done</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmerProfilePage;
