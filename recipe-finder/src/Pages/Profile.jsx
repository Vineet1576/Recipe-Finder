import '/public/profile.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaUserCircle, FaUtensils, FaHeart, FaListAlt, FaCheckCircle, FaEye } from 'react-icons/fa';

function Profile() {
    const navigate = useNavigate();

    // Get user data from localStorage
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
            setName(user.name || 'John Doe');
            setEmail(user.email || 'john@example.com');
        }
    }, []);

    // Fetch liked recipes from backend
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    useEffect(() => {
        // ...existing code...

        // Fetch liked recipes from backend if user is logged in
        const fetchLikedRecipes = async () => {
            if (userData && userData.userId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/recipes/liked/${userData.userId}`);
                    // Try multiple possible response shapes for robustness
                    if (Array.isArray(response.data)) {
                        setFavoriteRecipes(response.data);
                    } else if (Array.isArray(response.data.likedRecipes)) {
                        setFavoriteRecipes(response.data.likedRecipes);
                    } else if (Array.isArray(response.data.recipes)) {
                        setFavoriteRecipes(response.data.recipes);
                    } else {
                        setFavoriteRecipes([]);
                    }
                } catch (error) {
                    console.error('Error fetching liked recipes:', error);
                    setFavoriteRecipes([]);
                }
            } else {
                setFavoriteRecipes([]);
            }
        };
        fetchLikedRecipes();
    }, [userData]);

    // Helper: check if user has both regular and community data and they are identical (by name/email)
    const hasCommunityStats = userData && userData.recipesPosted !== undefined;
    const isIdentical = userData && userData.name && userData.email;

    // Dummy data for recent activity
    const recentActivity = [
        {
            type: 'Viewed',
            description: 'You viewed "Spaghetti Carbonara".',
            date: '2025-08-01',
        },
        {
            type: 'Favorited',
            description: 'You added "Chocolate Lava Cake" to your favorites.',
            date: '2025-07-29',
        },
        {
            type: 'Viewed',
            description: 'You viewed "Chicken Tikka Masala".',
            date: '2025-07-28',
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // If user has userId (community member), update their profile
            if (userData && userData.userId) {
                const updatedData = {
                    name,
                    email,
                    username,
                };

                // In a real application, you would make an API call to update the profile
                // const response = await axios.put(`http://localhost:5000/api/community/profile/${userData.userId}`, updatedData);

                // For now, just update localStorage
                const updatedUser = { ...userData, ...updatedData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUserData(updatedUser);
            }

            // Create success message
            const messageBox = document.createElement('div');
            messageBox.className = 'custom-alert';
            messageBox.innerHTML = `
                <div class="custom-alert-content">
                    <p><strong>Profile Updated Successfully!</strong></p>
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <button onclick="this.parentElement.parentElement.remove()">OK</button>
                </div>
            `;
            document.body.appendChild(messageBox);

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        const messageBox = document.createElement('div');
        messageBox.className = 'custom-alert';
        messageBox.innerHTML = `
            <div class="custom-alert-content">
                <p>You have been logged out successfully.</p>
                <button onclick="this.parentElement.parentElement.remove(); window.location.href='/'">OK</button>
            </div>
        `;
        document.body.appendChild(messageBox);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Format role for display
    const formatRole = (role) => {
        if (!role) return 'Member';
        return role.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Format preferences for display
    const formatPreferences = (prefs) => {
        if (!prefs) return [];
        return prefs.split(',').map(pref => pref.trim()).filter(Boolean);
    };

    return (
        <>
            <Navbar />

            <main className="main">
                {/* Profile Section */}
                <section className="profile-section">
                    <h1><FaUserCircle /> Hello {name}</h1>
                    <div className="profile-container">
                        <div className="profile-avatar">
                            {userData?.avatar ? (
                                <img src={userData.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            ) : (
                                <span className="avatar-text">
                                    {userData?.name
                                        ? userData.name
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase())
                                            .slice(0, 2)
                                            .join('')
                                        : 'U'}
                                </span>
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className="custom-file-upload">
                            <FaEdit /> Change Avatar
                        </label>
                        <input type="file" id="avatar-upload" accept="image/*" />
                        <form className="form-base" id='form-base' onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="profile-name" className="input-label"><FaUser /> Name</label>
                                <input
                                    type="text"
                                    id="profile-name"
                                    className="input-base"
                                    value={name}
                                    disabled={!isEditing}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-email" className="input-label"><FaEnvelope /> Email</label>
                                <input
                                    type="email"
                                    id="profile-email"
                                    className="input-base"
                                    value={email}
                                    disabled={!isEditing}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="btn-group">
                                {!isEditing ? (
                                    <button type="button" className="view-recipe-btn" onClick={toggleEdit}>
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button type="submit" className="view-recipe-btn" disabled={loading}>
                                            {loading ? <FaSave /> : <FaCheckCircle />} {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button type="button" className="view-recipe-btn" onClick={toggleEdit}>
                                            <FaTimes /> Cancel
                                        </button>
                                    </>
                                )}
                                <button type="button" className="view-recipe-btn" onClick={handleLogout}>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Show button to access members page if both data sets are present and identical */}
                    {hasCommunityStats && isIdentical && (
                        <div>
                            <button className="view-recipe-btn" onClick={() => navigate('/members')}>
                                <FaUsers /> Go to Members Page
                            </button>
                        </div>
                    )}
                </section>

                {/* Original Favorites Section */}
                <section className="favorites-section">
                    <h2><FaHeart /> Saved Recipes</h2>
                    <div className="favorites-list">
                        {favoriteRecipes.length === 0 ? (
                            <p>No liked recipes yet.</p>
                        ) : (
                            favoriteRecipes.map((recipe, idx) => (
                                <div className="favorite-card" key={recipe._id || recipe.id || idx}>
                                    {recipe.image ? (
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            loading="lazy"
                                        />
                                    ) : null}
                                    <div>
                                        <h3><FaUtensils /> {recipe.title}</h3>
                                        <p>{recipe.description}</p>
                                        <p style={{ textAlign: 'right', marginBottom: '20px', marginTop: '10px', fontWeight: '800' }}><FaUser /> Chef: "{recipe.chefName}"</p>
                                        <button className="view-recipe-btn" onClick={() => navigate(`/recipes/${recipe._id || recipe.id}`)}>
                                            <FaEye /> View Recipe
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Recent Activity Section */}
                <section className="activity-section">
                    <h2><FaListAlt /> Recent Activity</h2>
                    <div className="activity-list">
                        {favoriteRecipes.length === 0 ? (
                            <p>No liked recipes yet.</p>
                        ) : (
                            favoriteRecipes.map((recipe, idx) => (
                                <div className="activity-card" key={recipe._id || recipe.id || idx}>
                                    <span className="activity-type favorited"><FaHeart /> Liked</span>
                                    <h3><FaUtensils /> {recipe.title}</h3>
                                    <h4><FaUser /> <strong>Chef:</strong> {recipe.chefName}</h4>
                                    <button className="view-recipe-btn" onClick={() => navigate(`/recipes/${recipe._id || recipe.id}`, { state: { recipe } })}>
                                        <FaEye /> View Recipe
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Profile;