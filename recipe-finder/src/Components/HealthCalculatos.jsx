import React from 'react'
import { FaWeight, FaRulerVertical, FaVenusMars, FaBirthdayCake, FaCalculator, FaTint, FaHeartbeat } from 'react-icons/fa';

function HealthCalculatos() {
    // Reusable calculator card
    const iconMap = {
        "BMI Calculator": <FaHeartbeat />,
        "BMR Calculator": <FaCalculator />,
        "Daily Water Intake": <FaTint />,
    };
    const CalculatorCard = ({ title, children, className }) => (
        <div className={`calculator-card ${className}`}>
            <h3 className="form-base-label">{iconMap[title]} {title}</h3>
            {children}
        </div>
    );

    // BMI Calculator
    function BMIForm() {
        const [height, setHeight] = React.useState("");
        const [weight, setWeight] = React.useState("");
        const [bmi, setBmi] = React.useState(null);
        const [category, setCategory] = React.useState("");
        function calculateBMI(e) {
            e.preventDefault();
            if (!height || !weight) return;
            const h = parseFloat(height) / 100;
            const w = parseFloat(weight);
            if (h > 0 && w > 0) {
                const bmiValue = w / (h * h);
                setBmi(bmiValue.toFixed(1));
                if (bmiValue < 18.5) setCategory("Underweight");
                else if (bmiValue < 25) setCategory("Normal weight");
                else if (bmiValue < 30) setCategory("Overweight");
                else setCategory("Obese");
            }
        }
        return (
            <form className="form-base" onSubmit={calculateBMI} aria-label="BMI Calculator">
                <label htmlFor="bmi-height" className="form-base-label"><FaRulerVertical /> Height (cm):</label>
                <input id="bmi-height" type="number" min="50" max="250" value={height} onChange={e => setHeight(e.target.value)} className="form-base-input" required />
                <label htmlFor="bmi-weight" className="form-base-label"><FaWeight /> Weight (kg):</label>
                <input id="bmi-weight" type="number" min="20" max="300" value={weight} onChange={e => setWeight(e.target.value)} className="form-base-input" required />
                <button type="submit" className="start-now-btn"><FaHeartbeat /> Calculate BMI</button>
                {bmi && (
                    <div className="message calc-result">
                        <strong>BMI:</strong> {bmi} ({category})
                    </div>
                )}
            </form>
        );
    }

    // BMR Calculator
    function BMRForm() {
        const [gender, setGender] = React.useState("male");
        const [age, setAge] = React.useState("");
        const [height, setHeight] = React.useState("");
        const [weight, setWeight] = React.useState("");
        const [bmr, setBmr] = React.useState(null);
        function calculateBMR(e) {
            e.preventDefault();
            if (!age || !height || !weight) return;
            const a = parseInt(age);
            const h = parseFloat(height);
            const w = parseFloat(weight);
            let bmrValue = 0;
            if (gender === "male") {
                bmrValue = 88.36 + (13.4 * w) + (4.8 * h) - (5.7 * a);
            } else {
                bmrValue = 447.6 + (9.2 * w) + (3.1 * h) - (4.3 * a);
            }
            setBmr(bmrValue.toFixed(0));
        }
        return (
            <form className="form-base" onSubmit={calculateBMR} aria-label="BMR Calculator">
                <label className="form-base-label"><FaVenusMars /> Gender:</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="form-base-input">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <label htmlFor="bmr-age" className="form-base-label"><FaBirthdayCake /> Age:</label>
                <input id="bmr-age" type="number" min="10" max="120" value={age} onChange={e => setAge(e.target.value)} className="form-base-input" required />
                <label htmlFor="bmr-height" className="form-base-label"><FaRulerVertical /> Height (cm):</label>
                <input id="bmr-height" type="number" min="50" max="250" value={height} onChange={e => setHeight(e.target.value)} className="form-base-input" required />
                <label htmlFor="bmr-weight" className="form-base-label"><FaWeight /> Weight (kg):</label>
                <input id="bmr-weight" type="number" min="20" max="300" value={weight} onChange={e => setWeight(e.target.value)} className="form-base-input" required />
                <button type="submit" className="start-now-btn"><FaCalculator /> Calculate BMR</button>
                {bmr && (
                    <div className="message calc-result">
                        <strong>BMR:</strong> {bmr} kcal/day
                    </div>
                )}
            </form>
        );
    }

    // Water Intake Calculator
    function WaterForm() {
        const [weight, setWeight] = React.useState("");
        const [intake, setIntake] = React.useState(null);
        function calculateWater(e) {
            e.preventDefault();
            if (!weight) return;
            const w = parseFloat(weight);
            const waterMl = w * 35;
            setIntake((waterMl / 1000).toFixed(2));
        }
        return (
            <form className="form-base" onSubmit={calculateWater} aria-label="Water Intake Calculator">
                <label htmlFor="water-weight" className="form-base-label"><FaWeight /> Weight (kg):</label>
                <input id="water-weight" type="number" min="20" max="300" value={weight} onChange={e => setWeight(e.target.value)} className="form-base-input" required />
                <button type="submit" className="start-now-btn"><FaTint /> Calculate Water Intake</button>
                {intake && (
                    <div className="message calc-result">
                        <strong>Recommended:</strong> {intake} L/day
                    </div>
                )}
            </form>
        );
    }

    return (
        <section className="health-calculators">
            <h2><FaHeartbeat /> Personal Health Calculators</h2>
            <div className="calculator-cards">
                <CalculatorCard title="BMI Calculator" className="bmi-card">
                    <BMIForm />
                </CalculatorCard>
                <CalculatorCard title="BMR Calculator" className="bmr-card">
                    <BMRForm />
                </CalculatorCard>
                <CalculatorCard title="Daily Water Intake" className="water-card">
                    <WaterForm />
                </CalculatorCard>
            </div>
        </section>
    );
}

export default HealthCalculatos
