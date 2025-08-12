import React from 'react';
import { useState, useEffect } from 'react';
import '/public/nutrition.css';
import NutritionTracker from '../Components/NutritionTracker';
import HealthCalculatos from '../Components/HealthCalculatos';
import { FaPlayCircle, FaTint, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';

function Nutrition() {
    const [macroCards, setMacroCards] = useState([]);
    const [microCards, setMicroCards] = useState([]);
    const [hydrationTips, setHydrationTips] = useState([]);
    const [faqs, setFaqs] = useState([]);

    const highlights = [
        '🍎 Balanced Meals Made Simple',
        "💧 Hydration Hacks You Didn't Know",
        '🥦 Superfoods for Daily Vitality',
        '🏋️‍♂️ Nutrition for Muscle Growth & Fat Loss',
        '🧠 Foods That Boost Brain Power',
    ];

    useEffect(() => {
        const fetchNutritionData = async () => {
            try {
                const [macrosRes, microsRes, hydrationRes, faqsRes] = await Promise.all([
                    axios.get('/api/nutritionData/macronutrients'),
                    axios.get('/api/nutritionData/micronutrients'),
                    axios.get('/api/nutritionData/hydration-tips'),
                    axios.get('/api/nutritionData/faqs'),
                ]);
                setMacroCards(macrosRes.data);
                setMicroCards(microsRes.data);
                setHydrationTips(hydrationRes.data);
                setFaqs(faqsRes.data);
            } catch (error) {
                console.error("Error fetching nutrition data", error);
            }
        };
        fetchNutritionData();
    }, []);
    const getIcon = (iconName) => {
        const IconComponent = FaIcons[iconName];
        return IconComponent ? <IconComponent /> : <FaIcons.FaStar />;
    };
    return (
        <main>
            <section className="pro-nutrition-guide">
                <div className="guide-content">
                    <h2>Pro Nutrition Guide</h2>
                    <p>
                        Unlock the secrets to a balanced diet, healthy living, and optimal performance.
                        Learn how to fuel your body with the right nutrients for every goal!
                    </p>
                    <ul className="nutrition-highlights">
                        {highlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                        ))}
                    </ul>
                    <a href='#macro-breakdown' className="start-now-btn"><FaPlayCircle />Explore Full Guide</a>
                </div>
                <div className="guide-image">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Healthy food plate" />
                </div>
            </section>

            <NutritionTracker />

            <HealthCalculatos />

            <section className="macro-breakdown" id='macro-breakdown'>
                <h2>Macronutrient Breakdown</h2>
                <div className="cards">
                    {macroCards.map((card, idx) => (
                        <div className="card" key={idx}>
                            <h3>{getIcon(card.icon)} {card.title}</h3>
                            <p>{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="micro-guide">
                <h2>Micronutrients: Vitamins & Minerals</h2>
                <div className="nutrient-list-container">
                    <div className="cards">
                        {microCards.map((card, idx) => (
                            <div className="card" key={idx}>
                                <h3>{card.title}</h3>
                                <p><strong>Benefits:</strong> {card.benefits}</p>
                                <div className="source-container">
                                    <strong>Sources:</strong>
                                    {card.sources.map((src, i) => (
                                        <span className="source" key={i}>
                                            {src.icon} {src.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="hydration-tips">
                <h2><FaTint /> Hydration Tips</h2>
                <div className="cards">
                    {hydrationTips.map((tip, idx) => (
                        <div className="card" key={idx}>
                            <h3>{tip.icon} {tip.title}</h3>
                            <p>{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="meal-planner-tips" id="faq">
                <h2><FaQuestionCircle /> Nutrition FAQs</h2>
                <ul className="tips">
                    {faqs.map((faq, idx) => (
                        <li key={idx}>
                            <FaCheckCircle /> <strong>{faq.q}</strong> {faq.a}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
export default Nutrition;