import { useNavigate } from 'react-router-dom';

function RecipeCard({ filteredData = [], setFilteredData, setShowModal, setModalRecipe }) {
    const navigate = useNavigate();

    return (
        <section className="featured-recipes">
            <h2>🌟 Featured Recipes</h2>
            <p>Handpicked by our culinary experts and loved by our community</p>
            <div className="recipe-cards">
                {Array.isArray(filteredData) && filteredData.slice(0, 9).map((card, idx) => (
                    <div className="recipe-card" key={idx}>
                        <img src={card.image} alt={card.imageAlt || card.title} />
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>

                        <div className="recipe-tags">
                            {(card.tags || []).map((tag, i) => (
                                <span className="recipe-tag" key={i} tabIndex={0} role="button">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button className="view-recipe-btn" onClick={() => {
                            navigate('/recipedetail', { state: { recipe: card } });
                        }}>{card.viewRecipeBtnText || 'View Recipe →'}</button>
                    </div>
                ))}
            </div>

            <button
                className="view-recipe-btn"
                id="view-all-recipe"
                aria-label="View All Recipes"
                style={{ marginTop: '50px' }}
                onClick={() => navigate("/recipes")}
            >
                View All Recipes →
            </button>
        </section>
    );
}

export default RecipeCard;