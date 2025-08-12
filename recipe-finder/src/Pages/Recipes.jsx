import { useEffect, useState } from 'react'
import axios from 'axios';
import RecipeCard from '../Components/RecipeCard'
// import recipeData from '../assets/recipeData';
import '/public/recipes.css'
import { FaSearch } from 'react-icons/fa'

function Recipes() {
  const [filteredData, setFilteredData] = useState([]);
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
        // Optionally show error to user
      }
    };
    fetchRecipes();
  }, [tags, search]);
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
    </main>
  );
}

export default Recipes;