import React, { useState, useEffect } from 'react';
import '/public/meal-planner.css';
import GoalSelector from '../Components/GoalSelector';
import { FaCalendarAlt, FaClock, FaSeedling, FaWallet, FaPlayCircle, FaSave, FaDownload, FaEdit, FaTrashAlt, FaPlus, FaTrash, FaPrint, FaStar } from 'react-icons/fa';

function MealPlanner() {
  const [day, setDay] = useState('');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [weeklyMealPlan, setWeeklyMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleBreakfastChange = (e) => {
    setBreakfast(e.target.value);
  };

  const handleLunchChange = (e) => {
    setLunch(e.target.value);
  };

  const handleDinnerChange = (e) => {
    setDinner(e.target.value);
  };

  // Fetch meal plan from backend on mount
  useEffect(() => {
    const fetchMealPlan = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/meal-planner/meals');
        if (!res.ok) throw new Error('Failed to fetch meal plan');
        const data = await res.json();
        setWeeklyMealPlan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlan();
  }, []);

  // Add or update meal for a day
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!day || !breakfast || !lunch || !dinner) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/meal-planner/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, breakfast, lunch, dinner })
      });
      if (!res.ok) throw new Error('Failed to save meal');
      const savedMeal = await res.json();
      // Update or add meal for the day
      setWeeklyMealPlan(prev => {
        const filtered = prev.filter(m => m.day !== day);
        return [...filtered, savedMeal];
      });
      setDay('');
      setBreakfast('');
      setLunch('');
      setDinner('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <FaClock />, text: 'Save time on cooking and shopping' },
    { icon: <FaSeedling />, text: 'Make healthier food choices' },
    { icon: <FaWallet />, text: 'Stick to your grocery budget' },
  ];
  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  // Remove static weeklyPlan, now using weeklyMealPlan state
  const tips = [
    'Plan meals ahead to save time and reduce stress during the week.',
    'Balance your meals with proteins, veggies, and healthy carbs.',
    'Prep ingredients in advance for quick assembly.',
    'Use leftovers creatively to minimize food waste.',
    'Include a variety of cuisines and flavors to keep things interesting.',
    "Involve family members in meal planning to cater to everyone's preferences.",
    'Keep a well-stocked pantry with essentials to make meal prep easier.',
    'Use seasonal ingredients for fresher and more affordable meals.',
  ];

  return (
    <main>
      <section className="meal-planner-header">
        <h1><FaCalendarAlt /> Meal Planner</h1>
        <p>Plan your meals for the week and stay organized!</p>
        <h2 className="subheading">Stay healthy. Save time. Eat smarter. 🍽️</h2>
        <div className="benefits">
          {benefits.map((b, idx) => (
            <div className="benefit-card" key={idx}>
              {b.icon}
              <p>{b.text}</p>
            </div>
          ))}
        </div>
        <div className="cta-container">
          <a href="#weekly-plan" className="start-now-btn">
            <FaPlayCircle /> Start Planning Now
          </a>
        </div>
      </section>

      <GoalSelector />
      
      <section className="meal-planner-form-section" id='weekly-plan'>
        <div className="meal-planner-form">
          <h2>Add/Update Meal</h2>
          <label htmlFor="day">Day:</label>
          <select id="day" name="day" value={day} onChange={handleDayChange} required>
            <option value="" disabled>Select a day</option>
            {days.map(dayOption => (
              <option key={dayOption} value={dayOption}>{dayOption}</option>
            ))}
          </select>
          <label htmlFor="breakfast">Breakfast:</label>
          <input type="text" id="breakfast" name="breakfast" value={breakfast} placeholder="e.g. Oatmeal, Eggs, etc." onChange={handleBreakfastChange} required />
          <label htmlFor="lunch">Lunch:</label>
          <input type="text" id="lunch" name="lunch" value={lunch} placeholder="e.g. Salad, Sandwich, etc." onChange={handleLunchChange} required />
          <label htmlFor="dinner">Dinner:</label>
          <input type="text" id="dinner" name="dinner" value={dinner} placeholder="e.g. Pasta, Curry, etc." onChange={handleDinnerChange} required />
          <div className="btn-group">
            <a type="button" className="start-now-btn" onClick={(e) => { handleSubmit(e) }}><FaSave /> Save Meal</a>
            <a className="start-now-btn"><FaDownload /> Download Plan</a>
          </div>
        </div>
      </section>

      <section className="meal-planner-tips">
        <h2>Tips for Effective Meal Planning</h2>
        <ul>
          {tips.map((tip, idx) => (
            <li key={idx}><FaStar /> {tip}</li>
          ))}
        </ul>
      </section>

      <section className="weekly-plan">
        <h2>Your Weekly Meal Plan</h2>
        <div className="plan-table">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" style={{color:'red'}}>{error}</td></tr>
              ) : weeklyMealPlan.length === 0 ? (
                <tr><td colSpan="5">No meals planned yet.</td></tr>
              ) : (
                weeklyMealPlan.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day)).map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td className="breakfast">{row.breakfast}</td>
                    <td className="lunch">{row.lunch}</td>
                    <td className="dinner">{row.dinner}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setDay(row.day);
                          setBreakfast(row.breakfast);
                          setLunch(row.lunch);
                          setDinner(row.dinner);
                          // Scroll to the meal planner form section
                          const formSection = document.getElementById('weekly-plan');
                          if (formSection) {
                            formSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        style={{marginRight: '0.5rem'}}
                        title={`Edit ${row.day} meal`}
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}

export default MealPlanner;