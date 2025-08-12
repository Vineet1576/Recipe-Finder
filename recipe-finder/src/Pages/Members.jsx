
import React, { useState, useEffect } from 'react';
import '/public/Members.css';
import axios from 'axios';
import { FaUserCircle, FaRegStar, FaTrophy, FaMedal, FaUserFriends, FaChartLine, FaCrown, FaUtensils, FaCheckCircle, FaRegSmile, FaRegEnvelope, FaBell, FaFireAlt, FaUserEdit } from 'react-icons/fa';
import { MdFeedback, MdOutlineLeaderboard } from 'react-icons/md';
import { GiChefToque, GiCookingPot, GiProgression } from 'react-icons/gi';
import { BsFillPersonFill } from 'react-icons/bs';

const API_BASE = '/api/members';

function Members() {
  const [activeTab, setActiveTab] = useState('profile');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({
    recipesPosted: 0,
    challengesCompleted: 0,
    points: 0,
    level: ''
  });

  const [recipeForm, setRecipeForm] = useState({
    title: '',
    image: '',
    description: '',
    difficulty: 'Easy',
    prepTime: '',
    cookingTime: '',
    serving: '',
    ingredients: '',
    instructions: '',
    tags: '',
    chefName: '',
    chefImage: '',
  });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);

      // Set user stats from stored data
      setUserStats({
        recipesPosted: user.recipesPosted || 0,
        challengesCompleted: user.challengesCompleted || 0,
        points: user.points || 0,
        level: user.level || 'Beginner'
      });

      // Pre-fill chef name in recipe form
      setRecipeForm(prev => ({
        ...prev,
        chefName: user.name || '',
        chefImage: user.avatar || ''
      }));
    }
  }, []);

  // Fetch updated stats from server if user has userId
  useEffect(() => {
    if (userData && userData.userId) {
      axios.get(`${API_BASE}/${userData.userId}`)
        .then(res => {
          setUserStats({
            recipesPosted: res.data.recipesPosted || 0,
            challengesCompleted: res.data.challengesCompleted || 0,
            points: res.data.points || 0,
            level: res.data.level || 'Beginner'
          });
        })
        .catch(err => {
          console.error('Error fetching user stats:', err);
        });
    }
  }, [userData]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const comment = document.querySelector('.form-textarea').value.trim();
    if (!comment) {
      alert('Please enter your feedback.');
      return;
    }
    if (typeof feedbackRating !== 'number' || feedbackRating < 1 || feedbackRating > 5) {
      alert('Please select a rating between 1 and 5 stars.');
      return;
    }
    try {
      const userName = userData?.name || 'Anonymous';
      const userEmail = userData?.email || 'anonymous@example.com';
      await axios.post('/api/feedback', { userName, userEmail, rating: feedbackRating, comment });
      alert('Thank you for your feedback! We appreciate your input.');
      document.querySelector('.form-textarea').value = '';
      setFeedbackRating(0);
    } catch (err) {
      console.error('Feedback error:', err);
      alert('Failed to submit feedback.');
    }
  };

  const handleRecipeInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      // For demo: just use file name as image string (in real app, upload to server or cloud)
      setRecipeForm(f => ({ ...f, image: files[0] ? files[0].name : '' }));
    } else {
      setRecipeForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostError('');
    setPostSuccess('');

    try {
      const body = {
        title: recipeForm.title,
        authorId: userData?.userId || 'anonymous',
        image: recipeForm.image,
        description: recipeForm.description,
        difficulty: recipeForm.difficulty,
        prepTime: Number(recipeForm.prepTime) || 0,
        cookingTime: Number(recipeForm.cookingTime) || 0,
        serving: Number(recipeForm.serving) || 1,
        ingredients: recipeForm.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        instructions: recipeForm.instructions.split('\n').map(s => s.trim()).filter(Boolean),
        tags: recipeForm.tags.split(',').map(s => s.trim()).filter(Boolean),
        chefName: recipeForm.chefName || userData?.name || 'Anonymous',
        chefImage: recipeForm.chefImage || userData?.avatar || '',
      };

      if (!body.title || !body.description || !body.ingredients.length || !body.instructions.length) {
        throw new Error('Please fill in all required fields.');
      }

      await axios.post(`${API_BASE}/recipes`, body);
      setPostSuccess('Recipe posted successfully! It will be reviewed and published soon.');
      setRecipeForm({
        title: '', image: '', description: '', difficulty: 'Easy', prepTime: '', cookingTime: '', serving: '', ingredients: '', instructions: '', tags: '', chefName: userData?.name || '', chefImage: userData?.avatar || ''
      });

      // Refresh user stats after posting a recipe
      if (userData?.userId) {
        axios.get(`${API_BASE}/${userData.userId}`)
          .then(res => {
            const newStats = {
              recipesPosted: res.data.recipesPosted || 0,
              challengesCompleted: res.data.challengesCompleted || 0,
              points: res.data.points || 0,
              level: res.data.level || 'Beginner'
            };
            setUserStats(newStats);

            // Update localStorage with new stats
            const updatedUser = { ...userData, ...newStats };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(updatedUser);
          })
          .catch(err => console.error('Error refreshing stats:', err));
      }
    } catch (err) {
      console.error('Recipe post error:', err);
      setPostError(err.message || 'Error posting recipe. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const formatRole = (role) => {
    if (!role) return 'Member';
    return role.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPreferences = (prefs) => {
    if (!prefs) return [];
    return prefs.split(',').map(pref => pref.trim()).filter(Boolean);
  };

  const tabConfig = [
    { id: 'profile', label: 'Profile', icon: <FaUserCircle size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <MdFeedback size={20} /> },
    { id: 'recipes', label: 'Post Recipe', icon: <GiChefToque size={20} /> }
  ];

  return (
    <main className="members-main">
      {/* Header with User Stats */}
      <section className="members-header">
        <div>
          <h1>
            <FaUserFriends /> Members Area
          </h1>
          <p>Welcome back <strong style={{ fontWeight: "1000" }}>{userData?.name ? `, ${userData.name}` : ''}</strong>! <br />Here's your cooking journey dashboard</p>
        </div>
      </section>


      {/* Content Area */}
      <section className="members-content-wrapper">
        {/* Navigation */}
        <nav className="members-nav">
          {tabConfig.map(tab => (
            <button
              key={tab.id}
              className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2 className="tab-title">
              <FaUserFriends /> Your Profile
            </h2>

            <div className="profile-content">
              <div className="profile-avatar-section">
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
                <h3 className="profile-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BsFillPersonFill color="#d1323e" /> {userData?.name || 'User'}
                </h3>
                <p className="profile-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaCrown color="#f4b400" /> {formatRole(userData?.role) || 'Member'}
                </p>
                <p className="profile-level" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MdOutlineLeaderboard color="#007bff" /> {userStats.level}
                </p>
                <button className="edit-profile-btn" onClick={() => window.location.href = '/profile'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaUserEdit /> Edit Profile
                </button>
              </div>

              <div className="profile-details">
                <div className="profile-section">
                  <h4><FaRegSmile color="#28a745" style={{ marginRight: 4 }} /> About</h4>
                  <p>{userData?.bio || 'Passionate home cook who loves experimenting with flavors from around the world. Specializing in Mediterranean and Asian cuisine.'}</p>
                </div>

                <div className="profile-section">
                  <h4><FaUserFriends color="#007bff" style={{ marginRight: 4 }} /> Member Since</h4>
                  <p>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently joined'}</p>
                </div>

                <div className="profile-section">
                  <h4><FaChartLine color="#007bff" style={{ marginRight: 4 }} /> Statistics</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <GiCookingPot /> {userStats.recipesPosted}
                      </div>
                      <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.7' }}>Recipes Posted</p>
                    </div>
                    <div>
                      <div className="stat-number" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaCheckCircle /> {userStats.challengesCompleted}
                      </div>
                      <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.7' }}>Challenges Completed</p>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h4><FaTrophy color="#f4b400" style={{ marginRight: 4 }} /> Achievements</h4>
                  <div className="achievements-grid">
                    {userStats.recipesPosted > 0 && (
                      <div className="achievement-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <GiChefToque color="#7432d1ff" /> Recipe Contributor
                      </div>
                    )}
                    {userStats.recipesPosted === 0 && userStats.challengesCompleted === 0 && (
                      <div className="achievement-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaFireAlt /> New Member
                      </div>
                    )}
                  </div>
                </div>

                {userData?.preferences && (
                  <div className="profile-section">
                    <h4><FaUtensils color="#28a745" style={{ marginRight: 4 }} /> Cooking Preferences</h4>
                    <div className="preferences-tags">
                      {formatPreferences(userData.preferences).map((pref, index) => (
                        <span key={index} className="preference-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <FaRegStar color="#f4b400" /> {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="profile-section">
                  <h4><FaRegEnvelope color="#d1323e" style={{ marginRight: 4 }} /> Account Information</h4>
                  <div className="account-info">
                    <p><FaRegEnvelope color="#d1323e" style={{ marginRight: 4 }} /><strong>Email:</strong> {userData?.email || 'Not provided'}</p>
                    {userData?.username && <p><BsFillPersonFill color="#007bff" style={{ marginRight: 4 }} /><strong>Username:</strong> {userData.username}</p>}
                    <p><FaUserFriends color="#28a745" style={{ marginRight: 4 }} /><strong>Member Type:</strong> {userData?.userId ? 'Community Member' : 'Regular User'}</p>
                  </div>
                </div>

                <div className="profile-section">
                  <h4><FaBell color="#f4b400" style={{ marginRight: 4 }} /> Settings</h4>
                  <div className="settings-list">
                    <div className="setting-item">
                      <span><FaRegEnvelope color="#d1323e" style={{ marginRight: 4 }} /> Email Notifications</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="setting-item">
                      <span><FaUtensils color="#28a745" style={{ marginRight: 4 }} /> Recipe Recommendations</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="setting-item">
                      <span><FaCheckCircle color="#007bff" style={{ marginRight: 4 }} /> Challenge Reminders</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="tab-content">
            <h2 className="tab-title">
              💬 Give Feedback
            </h2>

            <div className="feedback-form">
              <div className="form-group">
                <label>Rate your experience</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${star <= feedbackRating ? 'active' : ''}`}
                      onClick={() => setFeedbackRating(star)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="form-select">
                  <option>General Feedback</option>
                  <option>Recipe Suggestions</option>
                  <option>Technical Issues</option>
                  <option>Feature Requests</option>
                  <option>Community Guidelines</option>
                </select>
              </div>
              <div className="form-group">
                <label>Your Role</label>
                <select className="form-select" defaultValue={userData?.role || 'member'}>
                  <option value="member">Member</option>
                  <option value="home-cook">Home Cook</option>
                  <option value="chef">Chef</option>
                  <option value="nutritionist">Nutritionist</option>
                  <option value="food-blogger">Food Blogger</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Your Feedback</label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts, suggestions, or issues..."
                  className="form-textarea"
                />
              </div>

              <button className="submit-button" onClick={handleFeedbackSubmit} style={{ textAlign: 'center' }}>
                <MdFeedback /> Submit Feedback
              </button>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="tab-content">
            <h2 className="tab-title">
              <GiChefToque size={20} /> Post Your Recipe
            </h2>

            <form className="recipe-form" onSubmit={handleRecipeSubmit}>
              <div className="form-group">
                <label>Recipe Title *</label>
                <input
                  type="text"
                  name="title"
                  value={recipeForm.title}
                  onChange={handleRecipeInputChange}
                  placeholder="e.g. Spicy Veggie Pasta"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Recipe Image (URL or file name)</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleRecipeInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Recipe Description *</label>
                <textarea
                  name="description"
                  value={recipeForm.description}
                  onChange={handleRecipeInputChange}
                  rows={3}
                  placeholder="Write a brief description of your recipe"
                  className="form-textarea"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={recipeForm.difficulty}
                    onChange={handleRecipeInputChange}
                    className="form-select"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prep Time (min)</label>
                  <input
                    type="number"
                    name="prepTime"
                    value={recipeForm.prepTime}
                    onChange={handleRecipeInputChange}
                    placeholder="e.g. 15"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Cooking Time (min)</label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={recipeForm.cookingTime}
                    onChange={handleRecipeInputChange}
                    placeholder="e.g. 30"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Servings</label>
                  <input
                    type="number"
                    name="serving"
                    value={recipeForm.serving}
                    onChange={handleRecipeInputChange}
                    placeholder="4"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ingredients (comma separated) *</label>
                <textarea
                  name="ingredients"
                  value={recipeForm.ingredients}
                  onChange={handleRecipeInputChange}
                  rows={3}
                  placeholder="List ingredients, separated by commas"
                  className="form-textarea"
                  required
                />
              </div>
              <div className="form-group">
                <label>Instructions (one per line) *</label>
                <textarea
                  name="instructions"
                  value={recipeForm.instructions}
                  onChange={handleRecipeInputChange}
                  rows={4}
                  placeholder="Step-by-step instructions..."
                  className="form-textarea"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={recipeForm.tags}
                  onChange={handleRecipeInputChange}
                  placeholder="e.g. vegetarian, quick, healthy"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Chef Name</label>
                <input
                  type="text"
                  name="chefName"
                  value={recipeForm.chefName}
                  onChange={handleRecipeInputChange}
                  placeholder="Your name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Chef Image (URL)</label>
                <input
                  type="text"
                  name="chefImage"
                  value={recipeForm.chefImage}
                  onChange={handleRecipeInputChange}
                  placeholder="Image URL (optional)"
                  className="form-input"
                />
              </div>
              {postError && <div className="form-error" style={{ color: 'red', marginBottom: '10px' }}>{postError}</div>}
              {postSuccess && <div className="form-success" style={{ color: 'green', marginBottom: '10px' }}>{postSuccess}</div>}
              <button className="submit-button" type="submit" disabled={posting} style={{ textAlign: 'center' }}>
                <GiChefToque /> {posting ? 'Posting...' : 'Post Recipe'}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default Members;