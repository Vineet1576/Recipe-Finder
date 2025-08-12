import React from 'react';
import { FaCalculator, FaHistory, FaVenusMars, FaBirthdayCake, FaRulerVertical, FaWeight, FaRunning, FaBullseye, FaSave } from 'react-icons/fa';

function GoalSelector() {
    const [gender, setGender] = React.useState("male");
    const [age, setAge] = React.useState("");
    const [height, setHeight] = React.useState("");
    const [weight, setWeight] = React.useState("");
    const [activity, setActivity] = React.useState("1.2");
    const [tdee, setTdee] = React.useState(null);
    const [goal, setGoal] = React.useState("");
    const [goalCalories, setGoalCalories] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [history, setHistory] = React.useState(() => {
        const saved = localStorage.getItem('goalSelectorHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [showHistory, setShowHistory] = React.useState(false);

    function calculateTDEE(e) {
        e.preventDefault();
        if (!age || !height || !weight) return;

        setLoading(true);
        setError("");

        const a = parseInt(age);
        const h = parseFloat(height);
        const w = parseFloat(weight);

        let bmr = 0;
        if (gender === "male") {
            bmr = 88.36 + (13.4 * w) + (4.8 * h) - (5.7 * a);
        } else {
            bmr = 447.6 + (9.2 * w) + (3.1 * h) - (4.3 * a);
        }

        const tdeeValue = bmr * parseFloat(activity);
        let goalCal = tdeeValue;

        if (goal === "lose") goalCal = tdeeValue - 500;
        else if (goal === "gain") goalCal = tdeeValue + 500;

        setTdee(tdeeValue.toFixed(0));
        setGoalCalories(goalCal.toFixed(0));

        const newEntry = {
            date: new Date().toLocaleString(),
            gender,
            age,
            height,
            weight,
            activity,
            goal,
            tdee: tdeeValue.toFixed(0),
            goalCalories: goalCal.toFixed(0)
        };

        setHistory(prev => {
            const updated = [newEntry, ...prev].slice(0, 10);
            localStorage.setItem('goalSelectorHistory', JSON.stringify(updated));
            return updated;
        });

        setLoading(false);

        // Reset form
        setGender("male");
        setAge("");
        setHeight("");
        setWeight("");
        setActivity("1.2");
        setGoal("");
    }

    return (
        <section className="nutrition-tracker">
            <h2><FaCalculator /> TDEE Calculator & Goal Selector</h2>
            <form className="tracker-form form-base" onSubmit={calculateTDEE} aria-label="TDEE Calculator">
                <label className="form-base-label"><FaVenusMars /> Gender:</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="form-base-input">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label htmlFor="tdee-age" className="form-base-label"><FaBirthdayCake /> Age:</label>
                <input id="tdee-age" type="number" min="10" max="120" value={age} onChange={e => setAge(e.target.value)} className="form-base-input" required />

                <label htmlFor="tdee-height" className="form-base-label"><FaRulerVertical /> Height (cm):</label>
                <input id="tdee-height" type="number" min="50" max="250" value={height} onChange={e => setHeight(e.target.value)} className="form-base-input" required />

                <label htmlFor="tdee-weight" className="form-base-label"><FaWeight /> Weight (kg):</label>
                <input id="tdee-weight" type="number" min="20" max="300" value={weight} onChange={e => setWeight(e.target.value)} className="form-base-input" required />

                <label className="form-base-label"><FaRunning /> Activity Level:</label>
                <select value={activity} onChange={e => setActivity(e.target.value)} className="form-base-input">
                    <option value="1.2">Sedentary (little/no exercise)</option>
                    <option value="1.375">Lightly active (1-3 days/week)</option>
                    <option value="1.55">Moderately active (3-5 days/week)</option>
                    <option value="1.725">Very active (6-7 days/week)</option>
                    <option value="1.9">Extra active (hard exercise/job)</option>
                </select>

                <label className="form-base-label"><FaBullseye /> Goal:</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} className="form-base-input">
                    <option value="">Maintain Weight</option>
                    <option value="lose">Lose Weight</option>
                    <option value="gain">Gain Weight</option>
                </select>

                <div className="btn-group">
                    <button type="submit" className="start-now-btn" disabled={loading}>
                        {loading ? <FaSave /> : <FaCalculator />} {loading ? 'Saving...' : 'Calculate TDEE & Goal'}
                    </button>
                    {history.length > 0 && (
                        <button
                            type="button"
                            className="start-now-btn"
                            onClick={() => setShowHistory(h => !h)}
                        >
                            <FaHistory /> {showHistory ? 'Hide History' : 'Show History'}
                        </button>
                    )}
                </div>
            </form>

            {error && <div>{error}</div>}

            {(tdee || goalCalories) && (
                <div className="mealplanner-result">
                    {tdee && <div><strong>TDEE:</strong> {tdee} kcal/day</div>}
                    {goalCalories && <div><strong>Goal Calories:</strong> {goalCalories} kcal/day</div>}
                </div>
            )}

            {showHistory && history.length > 0 && (
                <div className="plan-table">
                    <h3><FaHistory /> History (last 10 calculations)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Height</th>
                                <th>Weight</th>
                                <th>Activity</th>
                                <th>Goal</th>
                                <th>TDEE</th>
                                <th>Goal Calories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.date}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.age}</td>
                                    <td>{item.height}</td>
                                    <td>{item.weight}</td>
                                    <td>{item.activity}</td>
                                    <td>{item.goal || 'Maintain'}</td>
                                    <td>{item.tdee}</td>
                                    <td>{item.goalCalories}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default GoalSelector;