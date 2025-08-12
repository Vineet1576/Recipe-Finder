import React, { useState, useEffect } from 'react';
import '/public/RecipeDetail.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShareAlt, FaUser, FaUserCircle, FaCheck, FaPlus, FaUsers, FaClock, FaChartBar, FaUtensils, FaStar, FaCommentDots, FaThumbsUp, FaLightbulb, FaMinus, FaTimes } from 'react-icons/fa';

function RecipeDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    // Prefer recipe from navigation state for instant display
    const navRecipe = location.state?.recipe;
    const recipeId = navRecipe?._id || location.state?.recipeId || location.pathname.split('/').pop();

    // State management
    const [recipeData, setRecipeData] = useState(navRecipe || null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [likes, setLikes] = useState(0);
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [servings, setServings] = useState(1);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showNutrition, setShowNutrition] = useState(false);
    const [cookingTimer, setCookingTimer] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Fetch recipe details from backend only if not present in navigation state
    useEffect(() => {
        if (navRecipe) {
            setRecipeData(navRecipe);
            setLikes(navRecipe.likes || 0);
            setRating(navRecipe.rating || 0);
            setServings(navRecipe.servings || 1);
            return;
        }
        if (!recipeId) return;
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`/api/recipes/${recipeId}`);
                setRecipeData(res.data);
                setLikes(res.data.likes || 0);
                setRating(res.data.rating || 0);
                setServings(res.data.servings || 1);
                // If you have comments in backend, fetch here
                // setComments(res.data.comments || []);
            } catch (err) {
                setRecipeData(null);
            }
        };
        fetchRecipe();
    }, [recipeId, navRecipe]);

    // Like handler: toggle like and update backend/UI
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const handleLike = async () => {
        if (!recipeData?._id) return;
        // Get userId from localStorage (same as Profile.jsx)
        const storedUser = localStorage.getItem('user');
        let userId = null;
        if (storedUser) {
            try {
                userId = JSON.parse(storedUser).userId;
            } catch { }
        }
        if (!userId) {
            alert('You must be logged in to like recipes.');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE}/api/recipes/${recipeData._id}/like`, { like: !isLiked, userId });
            setIsLiked(!isLiked);
            setLikes(res.data.likes);
        } catch (err) {
            // Optionally show error
        }
    };

    // Rating handler: update backend and UI
    const handleRating = async (newRating) => {
        if (!recipeData?._id) return;
        setUserRating(newRating);
        try {
            const res = await axios.post(`${API_BASE}/api/recipes/${recipeData._id}/rate`, { rating: newRating });
            setRating(res.data.rating);
            // Optionally update review count if backend returns it
            if (typeof res.data.reviews !== 'undefined') {
                setRecipeData(prev => ({ ...prev, reviews: res.data.reviews }));
            }
        } catch (err) {
            // Optionally show error
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            // Optionally: send to backend
            const comment = {
                id: comments.length + 1,
                author: "You",
                avatar: "YU",
                text: newComment,
                time: "Just now",
                likes: 0
            };
            setComments([comment, ...comments]);
            setNewComment('');
        }
    };

    const adjustServings = (newServings) => {
        setServings(Math.max(1, newServings));
    };

    const toggleStep = (stepIndex) => {
        setCompletedSteps(prev =>
            prev.includes(stepIndex)
                ? prev.filter(i => i !== stepIndex)
                : [...prev, stepIndex]
        );
    };

    const startTimer = (minutes) => {
        setCookingTimer(minutes * 60);
    };

    const stopTimer = () => {
        setCookingTimer(null);
    };

    useEffect(() => {
        let interval;
        if (cookingTimer > 0) {
            interval = setInterval(() => {
                setCookingTimer(prev => prev - 1);
            }, 1000);
        } else if (cookingTimer === 0) {
            alert("Timer finished! 🍽️");
            setCookingTimer(null);
        }
        return () => clearInterval(interval);
    }, [cookingTimer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (recipeData === null) {
        return (
            <div className="recipe-detail-main">
                <div className="recipe-detail-content">
                    <h2>Recipe Not Found</h2>
                    <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }
    if (!recipeData) {
        return (
            <div className="recipe-detail-main">
                <div className="recipe-detail-content">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }


    return (
        <main className="recipe-detail-main">
            <div className="recipe-detail-container">
                {/* Header Section */}
                <div className="recipe-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Back
                    </button>
                    <div className="recipe-actions-header">
                        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                            {isLiked ? <FaHeart /> : <FaRegHeart />} {likes}
                        </button>
                        <button className={`action-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                            {isSaved ? <FaBookmark /> : <FaRegBookmark />} Save
                        </button>
                        <button className="action-btn">
                            <FaShareAlt /> Share
                        </button>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="recipe-image-section">
                    <div className="main-image-container">
                        {((Array.isArray(recipeData.images) && recipeData.images[activeImageIndex]) || recipeData.image) ? (
                            <img
                                className="recipe-main-image"
                                src={Array.isArray(recipeData.images) ? recipeData.images[activeImageIndex] : recipeData.image}
                                alt={recipeData.title}
                            />
                        ) : null}
                        {cookingTimer && (
                            <div className="cooking-timer">
                                🕐 {formatTime(cookingTimer)}
                            </div>
                        )}
                    </div>
                    {Array.isArray(recipeData.images) && recipeData.images.length > 1 && (
                        <div className="image-thumbnails">
                            {recipeData.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${recipeData.title} view ${index + 1}`}
                                    className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                                    onClick={() => setActiveImageIndex(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recipe Info */}
                <div className="recipe-info-section">
                    <h1 className="recipe-title"><FaUtensils /> {recipeData.title}</h1>
                    <p className="recipe-description">{recipeData.description}</p>

                    {/* Author Info */}
                    <div className="author-section">
                        <div className="author-info">
                            <div className="author-avatar">
                                {recipeData.chefImage ? (
                                    <img src={recipeData.chefImage} alt={recipeData.chefName || recipeData.author || 'Chef'} />
                                ) : (
                                    <FaUserCircle />
                                )}
                            </div>
                            <div>
                                <h3 className="author-name"><FaUser /> {recipeData.chefName || recipeData.author || "Anonymous Chef"}</h3>
                            </div>
                        </div>
                        <button
                            className={`follow-btn ${isFollowing ? 'following' : ''}`}
                            onClick={handleFollow}
                        >
                            {isFollowing ? <FaCheck /> : <FaPlus />} {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>

                    {/* Rating Section */}
                    <div className="rating-section">
                        <div className="recipe-rating">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className={star <= rating ? 'star filled' : 'star'}><FaStar /></span>
                                ))}
                            </div>
                            <span className="rating-text">{rating} ({typeof recipeData.reviews !== 'undefined' ? recipeData.reviews : 'No'} reviews)</span>
                        </div>

                        <div className="user-rating">
                            <span>Your rating:</span>
                            <div className="user-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={star <= userRating ? 'star filled clickable' : 'star clickable'}
                                        onClick={() => handleRating(star)}
                                    >
                                        <FaStar />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recipe Meta */}
                    <div className="recipe-meta">
                        <div className="meta-item">
                            <span className="meta-icon"><FaClock /></span>
                            <div>
                                <strong>Prep Time</strong>
                                <p>{recipeData.prepTime || "-"} min</p>
                            </div>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon"><FaUtensils /></span>
                            <div>
                                <strong>Cooking Time</strong>
                                <p>{
                                    typeof recipeData.cookingTime !== 'undefined' && recipeData.cookingTime !== null
                                        ? recipeData.cookingTime
                                        : (typeof recipeData.cookTime !== 'undefined' && recipeData.cookTime !== null
                                            ? recipeData.cookTime
                                            : '-')
                                } min</p>
                            </div>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon"><FaUsers /></span>
                            <div>
                                <strong>Servings</strong>
                                <div className="servings-control">
                                    <button onClick={() => adjustServings(servings - 1)}><FaMinus /></button>
                                    <span>{servings}</span>
                                    <button onClick={() => adjustServings(servings + 1)}><FaPlus /></button>
                                </div>
                            </div>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon"><FaChartBar /></span>
                            <div>
                                <strong>Difficulty</strong>
                                <p className={`difficulty ${recipeData.difficulty?.toLowerCase() || 'easy'}`}>
                                    {recipeData.difficulty || "Easy"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="recipe-tags">
                        {recipeData.tags?.map((tag, i) => (
                            <span className="recipe-tag" key={i}>{tag}</span>
                        ))}
                    </div>

                    {/* Nutrition Toggle */}
                    <button
                        className="nutrition-toggle"
                        onClick={() => setShowNutrition(!showNutrition)}
                    >
                        <FaChartBar /> Nutrition Facts {showNutrition ? '▼' : '▶'}
                    </button>

                    {showNutrition && recipeData.nutrition && (
                        <div className="nutrition-panel">
                            <h3>Nutrition per serving</h3>
                            <div className="nutrition-grid">
                                {Object.entries(recipeData.nutrition).map(([key, value]) => (
                                    <div key={key} className="nutrition-item">
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ingredients Section */}
                <div className="recipe-section">
                    <h2 className="section-title"><FaUtensils /> Ingredients</h2>
                    <div className="ingredients-list">
                        {recipeData.ingredients?.map((ingredient, i) => (
                            <div key={i} className="ingredient-item">
                                <input type="checkbox" id={`ingredient-${i}`} />
                                <label htmlFor={`ingredient-${i}`}>{ingredient}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="recipe-section">
                    <div className="instructions-header">
                        <h2 className="section-title"><FaUserCircle /> Instructions</h2>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="timer-btn"
                                onClick={() => startTimer(parseInt(recipeData.cookTime) || 25)}
                                disabled={!!cookingTimer}
                            >
                                <FaClock /> Start Timer
                            </button>
                            <button
                                className="timer-btn"
                                onClick={stopTimer}
                                disabled={!cookingTimer}
                            >
                                <FaTimes /> Stop Timer
                            </button>
                        </div>
                    </div>
                    <div className="instructions-list">
                        {recipeData.instructions?.map((step, i) => (
                            <div key={i} className={`instruction-step ${completedSteps.includes(i) ? 'completed' : ''}`}>
                                <div className="step-number">{i + 1}</div>
                                <div className="step-content">
                                    <p>{step}</p>
                                    <button
                                        className="complete-step-btn"
                                        onClick={() => toggleStep(i)}
                                    >
                                        {completedSteps.includes(i) ? '✓ Done' : 'Mark Done'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                {recipeData.tips && (
                    <div className="recipe-section">
                        <h2 className="section-title"><FaLightbulb /> Pro Tips</h2>
                        <div className="tips-list">
                            {recipeData.tips.map((tip, i) => (
                                <div key={i} className="tip-item">
                                    <span className="tip-icon"><FaLightbulb /></span>
                                    <p>{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="recipe-section">
                    <h2 className="section-title"><FaCommentDots /> Comments ({comments.length})</h2>

                    {/* Add Comment Form */}
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <div className="comment-input-container">
                            <div className="user-avatar"><FaUserCircle /></div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts about this recipe..."
                                className="comment-input"
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
                            Post Comment
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-avatar">{comment.avatar}</div>
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <strong className="comment-author">{comment.author}</strong>
                                        <span className="comment-time">{comment.time}</span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                    <div className="comment-actions">
                                        <button className="comment-like-btn">
                                            <FaThumbsUp /> {comment.likes}
                                        </button>
                                        <button className="comment-reply-btn">
                                            <FaCommentDots /> Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Recipes */}
                <div className="recipe-section">
                    <h2 className="section-title"><FaShareAlt /> You Might Also Like</h2>
                    <div className="related-recipes">
                        {/* Optionally fetch related recipes from backend */}
                        {[
                            { title: "Creamy Tuscan Chicken", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop", time: "30 mins" },
                            { title: "Mediterranean Quinoa Bowl", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop", time: "20 mins" },
                            { title: "Lemon Herb Salmon", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop", time: "25 mins" }
                        ].map((relatedRecipe, i) => (
                            <div key={i} className="related-recipe-card">
                                <img src={relatedRecipe.image} alt={relatedRecipe.title} />
                                <h4>{relatedRecipe.title}</h4>
                                <p>⏱️ {relatedRecipe.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RecipeDetail;