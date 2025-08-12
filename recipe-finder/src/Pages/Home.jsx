import React, { useEffect, useState } from 'react'
import RecipeCard from '../Components/RecipeCard'
import axios from 'axios';
import '/public/index.css'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();

  const [tags, setTags] = useState("");
  // Tag options as objects: { emoji, label, value }
  const tagOptions = [
    { emoji: "🥗", label: "Vegetarian", value: "Vegetarian" },
    { emoji: "⚡", label: "Quick Meals", value: "Quick Meals" },
    { emoji: "🍰", label: "Desserts", value: "Desserts" },
    { emoji: "💚", label: "Healthy", value: "Healthy" },
    { emoji: "🥑", label: "Keto", value: "Keto" },
    { emoji: "🌱", label: "Vegan", value: "Vegan" },
    { emoji: "🍜", label: "Asian", value: "Asian" },
    { emoji: "🍕", label: "Italian", value: "Italian" },
    { emoji: "🍔", label: "American", value: "American" },
    { emoji: "🌮", label: "Mexican", value: "Mexican" },
  ];
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      let url = 'http://localhost:5000/api/recipes';
      const params = [];
      if (tags) params.push(`tags=${encodeURIComponent(tags)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (params.length) url += '?' + params.join('&');
      try {
        const res = await axios.get(url);
        setFilteredData(res.data);
      } catch (err) {
        setFilteredData([]);
      }
    };
    fetchRecipes();
  }, [tags, search]);

  useEffect(() => {
    // Fetch feedback from backend
    axios.get('http://localhost:5000/api/feedback')
      .then(res => setFeedbacks(res.data))
      .catch(() => setFeedbacks([]));
  }, []);

  const whyChooseUs = [
    { icon: '🔍', title: 'Smart Search', desc: 'Find recipes by ingredients, dietary needs, or cooking time' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Cook with confidence using our mobile-optimized interface' },
    { icon: '👥', title: 'Community', desc: 'Share recipes and connect with fellow food enthusiasts' },
    { icon: '📊', title: 'Nutrition Info', desc: 'Track calories, macros, and nutritional information' },
  ];

  // Pick a random recipe from filteredData for Recipe of the Day
  const randomRecipe = Array.isArray(filteredData) && filteredData.length > 0
    ? filteredData[Math.floor(Math.random() * filteredData.length)]
    : null;

  return (
    <main>
      <section className="hero" aria-label="Discover Amazing Recipes">
        <div className="hero-content">
          <img
            src="https://storage.googleapis.com/a1aa/image/bd774eff-5fb6-4b83-09b2-ac32eff9760e.jpg"
            alt="Magnifying glass with fried egg inside"
            className="icon"
            width="100"
            height="100"
          />

          <h1>Discover Amazing Recipes</h1>
          <p className="hero-description">
            Join millions of food lovers in finding the perfect recipe for any occasion, dietary preference, or craving.
          </p>
          <form className="search-form" role="search" aria-label="Recipe Search" onSubmit={e => e.preventDefault()}>
            <input
              type="search"
              placeholder="Search 10,000+ recipes, ingredients, or cuisines..."
              aria-label="Search recipes"
              required
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Find Recipes">
              <FaSearch style={{ marginRight: '8px' }} />Find Recipes
            </button>
          </form>
          <div className="tags-container" aria-label="Recipe Tags">
            {tagOptions.map((tag, idx) => (
              <span
                className={`tag${tags === tag.value ? ' selected' : ''}`}
                tabIndex={0}
                role="button"
                key={idx}
                onClick={() => setTags(tag.value)}
                onKeyPress={e => { if (e.key === 'Enter') setTags(tag.value); }}
                aria-pressed={tags === tag.value}
              >
                {tag.emoji} {tag.label}
              </span>
            ))}
            {tags && (
              <span
                className="tag clear-tag"
                tabIndex={0}
                role="button"
                onClick={() => setTags("")}
                onKeyPress={e => { if (e.key === 'Enter') setTags(""); }}
                aria-pressed={false}
              >
                Clear
              </span>
            )}
          </div>
        </div>
      </section>
      <RecipeCard filteredData={filteredData} />

      <section className="recipe-of-the-day">
        <h2>🍲 Recipe of the Day</h2>
        {randomRecipe ? (
          <div className="recipe-card" style={{maxWidth: '1200px', margin: '0 auto'}}>
            <img src={randomRecipe.image || randomRecipe.imageSrc} alt={randomRecipe.imageAlt || randomRecipe.title} />
            <div className="recipe-info">
              <h3>{randomRecipe.title}</h3>
              <p style={{ margin: "0 auto", marginBottom: "20px", maxWidth: '800px' }}>{randomRecipe.description}</p>
              <button className="view-recipe-btn" onClick={() => navigate('/recipedetail', { state: { recipe: randomRecipe } })}>View Recipe →</button>
            </div>
          </div>
        ) : (
          <p>No recipe available.</p>
        )}
      </section>

      <section className="why-choose-us">
        <h2>✨ Why Choose Recipe Finder?</h2>
        <p>Everything you need for your culinary journey</p>
        <div className="cards">
          {whyChooseUs.map((item, idx) => (
            <div className="card" key={idx}>
              <span className="search-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-testimonials">
        <h2>What Our Users & Team Say</h2>
        <div className="testimonial-cards">
          {feedbacks.map((fb, idx) => (
            <div className="testimonial-card" key={"fb-" + idx}>
              <div className="initials">
                {fb.userName ? fb.userName.slice(0, 2).toUpperCase() : 'U'}
              </div>
              <h3>{fb.userName || "Anonymous"}</h3>

              {fb.rating && (
                <div className="rating-stars">
                  {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                </div>
              )}

              {fb.userRole && (<h4 className="role">{fb.userRole.charAt(0).toUpperCase() + fb.userRole.slice(1).toLowerCase()}</h4>
              )}
              <blockquote>"{fb.comment}"</blockquote>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

export default Home;