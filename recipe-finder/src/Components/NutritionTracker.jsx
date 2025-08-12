import '/public/NutritionTracker.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import NutritionChart from "../Components/NutritionChart";
import { FaChartLine, FaUtensils, FaExclamationTriangle, FaCheck, FaListAlt } from "react-icons/fa";

const meals = [
    { name: "Grilled Chicken & Quinoa", protein: 45, carbs: 35, fat: 15, calories: 500 },
    { name: "Paneer Tikka Wrap", protein: 30, carbs: 40, fat: 20, calories: 550 },
    { name: "Oats with Fruits & Nuts", protein: 15, carbs: 50, fat: 10, calories: 400 },
    { name: "Egg Bhurji & Toast", protein: 25, carbs: 30, fat: 18, calories: 450 },
    { name: "Tofu Stir Fry with Rice", protein: 35, carbs: 45, fat: 12, calories: 520 },
    { name: "Rajma Chawal", protein: 20, carbs: 55, fat: 8, calories: 480 },
    { name: "Salmon & Veggies", protein: 40, carbs: 25, fat: 20, calories: 500 },
    { name: "Moong Dal & Roti", protein: 22, carbs: 35, fat: 10, calories: 430 },
    { name: "Vegetable Fried Rice", protein: 15, carbs: 60, fat: 12, calories: 480 },
    { name: "Greek Yogurt with Honey", protein: 20, carbs: 30, fat: 5, calories: 250 },
    { name: "Chicken Salad", protein: 35, carbs: 20, fat: 15, calories: 400 },
    { name: "Pasta Primavera", protein: 20, carbs: 55, fat: 10, calories: 500 },
    { name: "Chickpea Curry with Rice", protein: 25, carbs: 50, fat: 15, calories: 550 },
    { name: "Vegetable Sambar with Idli", protein: 18, carbs: 45, fat: 8, calories: 400 },
    { name: "Paneer Bhurji with Paratha", protein: 30, carbs: 40, fat: 20, calories: 600 },
    { name: "Fish Curry with Rice", protein: 35, carbs: 50, fat: 15, calories: 550 },
    { name: "Mixed Vegetable Curry with Roti", protein: 20, carbs: 45, fat: 10, calories: 480 },
    { name: "Lentil Soup with Bread", protein: 15, carbs: 30, fat: 5, calories: 300 },
    { name: "Stuffed Bell Peppers", protein: 25, carbs: 40, fat: 15, calories: 500 },
    { name: "Chicken Biryani", protein: 30, carbs: 60, fat: 20, calories: 700 },
    { name: "Vegetable Khichdi", protein: 18, carbs: 50, fat: 10, calories: 450 },
];

const NutritionTracker = () => {
    const [inputs, setInputs] = useState({
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
    });
    const [percentages, setPercentages] = useState({ protein: 0, carbs: 0, fat: 0 });
    const [message, setMessage] = useState("");
    const [suggestedMeals, setSuggestedMeals] = useState([]);
    const [warnings, setWarnings] = useState({});
    const [showChart, setShowChart] = useState(false);
    const [history, setHistory] = useState([]);

    const RECOMMENDED = {
        calories: { min: 1200, max: 6500 },
        protein: { min: 30, max: 200 },
        carbs: { min: 100, max: 500 },
        fat: { min: 20, max: 200 },
    };

    useEffect(() => {
        const { protein, carbs, fat } = inputs;
        const total = parseFloat(protein) + parseFloat(carbs) + parseFloat(fat);
        if (total > 0) {
            setPercentages({
                protein: ((protein / total) * 100).toFixed(1),
                carbs: ((carbs / total) * 100).toFixed(1),
                fat: ((fat / total) * 100).toFixed(1),
            });
        } else {
            setPercentages({ protein: 0, carbs: 0, fat: 0 });
        }
    }, [inputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { calories, protein, carbs, fat } = inputs;
        if (!calories || !protein || !carbs || !fat) {
            setMessage("Please fill in all fields.");
            setShowChart(false);
            return;
        }
        // Warnings
        let currentWarnings = {};
        Object.keys(RECOMMENDED).forEach((key) => {
            const val = parseFloat(inputs[key]);
            if (val < RECOMMENDED[key].min) {
                currentWarnings[key] = `⚠️ ${key.charAt(0).toUpperCase() + key.slice(1)} too low!`;
            } else if (val > RECOMMENDED[key].max) {
                currentWarnings[key] = `⚠️ ${key.charAt(0).toUpperCase() + key.slice(1)} too high!`;
            }
        });
        setWarnings(currentWarnings);
        if (Object.keys(currentWarnings).length) {
            setMessage("Please check the warnings below.");
        } else {
            try {
                await axios.post('/api/nutrition/track', {
                    userId: 'demoUser',
                    calories: Number(calories),
                    protein: Number(protein),
                    carbs: Number(carbs),
                    fat: Number(fat)
                });
                setMessage("Nutrition data saved successfully! 🎉");
                setSuggestedMeals([]);
                setShowChart(true);
                fetchHistory();
            } catch (err) {
                setMessage("Failed to save nutrition data.");
            }
        }
    };

    // Fetch nutrition history from backend
    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/nutrition/demoUser/history');
            setHistory(res.data);
        } catch (err) {
            setHistory([]);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const suggestMeals = (e) => {
        if (e) e.preventDefault();
        const userProtein = parseInt(inputs.protein) || 0;
        const userCarbs = parseInt(inputs.carbs) || 0;
        const userFat = parseInt(inputs.fat) || 0;

        if (!userProtein && !userCarbs && !userFat) {
            setMessage("Please enter your macros to get meal suggestions.");
            return;
        }

        // Score meals by closeness to user's macro targets
        const scoredMeals = meals.map((meal) => {
            const score =
                Math.abs(meal.protein - userProtein / 3) +
                Math.abs(meal.carbs - userCarbs / 3) +
                Math.abs(meal.fat - userFat / 3);
            return { ...meal, score };
        });

        // Sort by best match (lowest score)
        const topMatches = scoredMeals.sort((a, b) => a.score - b.score).slice(0, 3);
        setSuggestedMeals(topMatches);
        setInputs({ calories: "", protein: "", carbs: "", fat: "" });
    };


    return (
        <section className="nutrition-tracker" aria-labelledby="nutrition-tracker-title">
            <h2 id="nutrition-tracker-title"><FaChartLine /> Nutrition Tracker</h2>
            <p><FaListAlt /> Track your daily calories, macros, and get meal suggestions based on your goals.</p>

            <form className="tracker-form form-base" onSubmit={handleSubmit} autoComplete="off" aria-label="Nutrition Form">
                <label htmlFor="calories" className="form-base-label"><FaChartLine /> Calories:</label>
                <input type="number" id="calories" name="calories" value={inputs.calories} onChange={handleChange} placeholder="e.g. 2000" className="form-base-input" min="0" required />

                <label htmlFor="protein" className="form-base-label"><FaUtensils /> Protein (g):</label>
                <input type="number" id="protein" name="protein" value={inputs.protein} onChange={handleChange} placeholder="e.g. 100" className="form-base-input" min="0" required />

                <label htmlFor="carbs" className="form-base-label"><FaUtensils /> Carbs (g):</label>
                <input type="number" id="carbs" name="carbs" value={inputs.carbs} onChange={handleChange} placeholder="e.g. 250" className="form-base-input" min="0" required />

                <label htmlFor="fat" className="form-base-label"><FaUtensils /> Fat (g):</label>
                <input type="number" id="fat" name="fat" value={inputs.fat} onChange={handleChange} placeholder="e.g. 70" className="form-base-input" min="0" required />

                <button type="submit" className="start-now-btn" aria-label="Track Nutrition" style={{ margin: "0 auto", width: "70%" }}>
                    <FaChartLine /> Track
                </button>
            </form>

            {message && <p className="message" role="status">{message}</p>}

            <a className="start-now-btn" type="button" onClick={suggestMeals} aria-label="Suggest Meals">
                <FaUtensils /> Suggest Meals
            </a>

            {suggestedMeals.length > 0 && (
                <div className="meal-suggestions">
                    <h4><FaUtensils /> Suggested Meals</h4>
                    <ul>
                        {suggestedMeals.map((meal, index) => (
                            <li key={index}>
                                <strong>{meal.name}</strong> – {meal.calories} kcal | {meal.protein}g P | {meal.carbs}g C | {meal.fat}g F
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {Object.keys(warnings).length > 0 && (
                <div className="warnings" role="alert">
                    {Object.values(warnings).map((warn, idx) => (
                        <div key={idx}><FaExclamationTriangle /> {warn}</div>
                    ))}
                </div>
            )}

            {showChart && history.length > 0 && (
                <NutritionChart dataHistory={history} />
            )}
        </section>
    );
};

export default NutritionTracker;