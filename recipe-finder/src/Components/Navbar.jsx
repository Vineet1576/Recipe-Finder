import { useNavigate, useLocation } from 'react-router-dom';
import '/public/index.css';
import { useState, useEffect } from 'react';
import { FaFire, FaHome, FaBookOpen, FaSeedling, FaUserFriends, FaPhoneAlt, FaLock, FaStar } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import Signup from './Signup';
import Login from './Login';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [userData, setUserData] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem('user');
            setUserData(stored ? JSON.parse(stored) : null);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleNav = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/recipes', label: 'Recipes', icon: <FaBookOpen /> },
        { path: '/meal-planner', label: 'Meal Planner', icon: <FaCalendarAlt /> },
        { path: '/nutrition', label: 'Nutrition', icon: <FaSeedling /> },
        { path: '/community', label: 'Community', icon: <FaUserFriends /> },
        { path: '/contact', label: 'Contact', icon: <FaPhoneAlt /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserData(null);
        navigate('/');
    };

    return (
        <header>
            <nav>
                <div className="logo-container" onClick={() => handleNav('/')}>
                    <div className="logo-text">
                        <div>Recipe</div>
                        <div>Finder</div>
                    </div>
                    <div className="recipes-available">
                        <FaFire />
                        <span>10,000+ Recipes Available</span>
                    </div>
                </div>

                <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span style={{ transform: menuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none' }}></span>
                    <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
                    <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
                </div>

                <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
                    {navLinks.map(({ path, label, icon }) => (
                        <li key={label}>
                            <a onClick={() => handleNav(path)} className={location.pathname === path ? 'active' : ''}>
                                {icon}<span>{label}</span>
                            </a>
                        </li>
                    ))}
                    {!userData ? (
                        <li>
                            <a onClick={() => setModalType('login')}><FaLock /> <span>Login</span></a>
                        </li>
                    ) : (
                        <li>
                            <a onClick={handleLogout}><FaLock /> <span>Logout</span></a>
                        </li>
                    )}
                </ul>

                <button className="career" onClick={() => handleNav('/career')}>
                    <FaStar />Career
                </button>

                {userData && (
                    <div style={{ position: 'relative' }}>
                        <a onClick={() => handleNav('/profile')}>
                            <div className="profileAvatar">
                                <span className="avatar-text">
                                    {userData.name
                                        ? userData.name.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('')
                                        : 'U'}
                                </span>
                            </div>
                        </a>
                    </div>
                )}
            </nav>

            {modalType && (
                <div className="modal-overlay" onClick={() => setModalType(null)}>
                    <div className="container" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setModalType(null)}>&times;</button>
                        {modalType === 'login' ? (
                            <Login onSwitchToSignup={() => setModalType('signup')} onClose={() => setModalType(null)} />
                        ) : (
                            <Signup onSwitchToLogin={() => setModalType('login')} onClose={() => setModalType(null)} />
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
