import '/public/career.css';
import { useState, useEffect } from 'react';
import Info from '../Components/Info';
import {
    FaSearch, FaUsers, FaMobile, FaChartBar, FaHospital,
    FaMoneyBillWave, FaPlane, FaGraduationCap, FaHamburger, FaHandshake,
    FaBolt, FaHeadset, FaFileAlt, FaBriefcase, FaSeedling, FaUsersCog, FaLaptopCode, FaPaintBrush, FaClipboardList, FaBullhorn, FaPaperPlane
} from 'react-icons/fa';
import { GiChefToque, GiMeal } from 'react-icons/gi';

import axios from 'axios';

function Career() {
    const [positions, setPositions] = useState([]);
    const [interviewSteps, setInterviewSteps] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        preferences: '',
        terms: false
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        if (formData.password !== formData.confirmPassword) {
            setStatus('Passwords do not match.');
            return;
        }
        if (!formData.terms) {
            setStatus('You must agree to the Terms and Conditions.');
            return;
        }
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                preferences: formData.preferences
            };
            const response = await axios.post('http://localhost:5000/api/career/apply', payload);
            setStatus(response.data.message || 'Application submitted successfully!');
            setFormData({ name: '', email: '', password: '', confirmPassword: '', preferences: '', terms: false });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setStatus(error.response.data.message);
            } else {
                setStatus('Failed to submit application. Please try again later.');
            }
        }
    };

    useEffect(() => {
        const fetchCareerData = async () => {
            try {
                const [posRes, stepsRes] = await Promise.all([
                    axios.get('/api/careerData/positions'),
                    axios.get('/api/careerData/interview-steps'),
                ]);
                setPositions(posRes.data);
                setInterviewSteps(stepsRes.data);
            } catch (err) {
                console.error("Error fetching career data", err);
            }
        };

        fetchCareerData();
    }, []);

    const whyChooseUs = [
        { icon: FaSearch, title: 'Smart Search', desc: 'Find recipes by ingredients, dietary needs, or cooking time' },
        { icon: FaMobile, title: 'Mobile Friendly', desc: 'Cook with confidence using our mobile-optimized interface' },
        { icon: FaUsers, title: 'Community', desc: 'Share recipes and connect with fellow food enthusiasts' },
        { icon: FaChartBar, title: 'Nutrition Info', desc: 'Track calories, macros, and nutritional information' },
    ];

    const positionFilters = [
        { label: 'All Positions', icon: <FaBriefcase /> },
        { label: 'Engineering', icon: <FaLaptopCode /> },
        { label: 'Chef', icon: <GiChefToque /> },
        { label: 'Designer', icon: <FaPaintBrush /> },
        { label: 'Product Manager', icon: <FaClipboardList /> },
        { label: 'Marketing', icon: <FaBullhorn /> }
    ];

    const benefits = [
        {
            icon: FaHospital,
            title: 'Health & Wellness',
            items: ['Premium health insurance', 'Dental & vision coverage', 'Mental health support', 'Gym membership stipend'],
        },
        {
            icon: FaMoneyBillWave,
            title: 'Financial Benefits',
            items: ['Competitive salary', 'Equity participation', '401(k) with matching', 'Performance bonuses'],
        },
        {
            icon: FaPlane,
            title: 'Time Off',
            items: ['Unlimited PTO', '12 company holidays', 'Sabbatical program', 'Parental leave'],
        },
        {
            icon: FaGraduationCap,
            title: 'Growth & Learning',
            items: ['$2,000 learning budget', 'Conference attendance', 'Internal mentorship', 'Career development'],
        },
    ];

    const values = [
        {
            icon: FaHamburger,
            title: 'Food Passion',
            desc: `We're all food enthusiasts who believe cooking brings people together. Our love for food drives everything we do.`,
        },
        {
            icon: FaHandshake,
            title: 'Collaboration',
            desc: `We work together across teams and time zones, sharing knowledge and supporting each other's growth.`,
        },
        {
            icon: FaBolt,
            title: 'Innovation',
            desc: `We embrace new technologies and creative solutions to solve complex problems in the food tech space.`,
        },
        {
            icon: FaHeadset,
            title: "Customer Support",
            desc: "Reliable assistance available 24/7 to help you with any questions or issues."
        }
    ];

    return (
        <main>
            <section className="career-section">
                <h1>Build the Future of Food Discovery</h1>
                <p>Join our passionate team of food lovers, tech innovators, and creative minds as we revolutionize how people discover, share, and enjoy recipes worldwide</p>
                <div className="btn-container">
                    <a href='#open-positions' className="start-now-btn">
                        <FaBriefcase />View Open Positions
                    </a>
                    <a href='#culture-values' className="start-now-btn">
                        <FaSeedling />Learn About Culture
                    </a>
                    <a href="#join-community-form" className="start-now-btn">
                        <FaUsersCog />Join Our Team
                    </a>
                </div>
                <p>15 open positions • Remote-friendly • Growing team</p>
            </section>

            <Info />

            <section className="why-choose-us">
                <h2>✨ Why Choose Recipe Finder?</h2>
                <p>Everything you need for your culinary journey</p>
                <div className="cards">
                    {whyChooseUs.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <div className="card" key={idx}>
                                <span className="search-icon"><IconComponent /></span>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="open-positions" id='open-positions'>
                <h2>Open Positions</h2>
                <form className="search-form" role="search">
                    <input type="search" placeholder="Search 10,000+ recipes, ingredients, or cuisines..." aria-label="Search recipes" required />
                    <button type="submit" aria-label="Find Recipes">
                        <FaSearch className="icon-search" />Find Recipes
                    </button>
                </form>
                <div className="position-filters">
                    {positionFilters.map(({ label, icon }, idx) => (
                        <a href="#" key={idx} className="flex items-center text-sm hover:text-blue-600 transition">
                            {icon}
                            <span style={{ paddingLeft: '8px' }}>{label}</span>
                        </a>
                    ))}
                </div>

                <div className="cards">
                    {positions.map((pos, idx) => (
                        <div className={`card ${pos.className}`} key={idx}>
                            <div className="card-header">
                                <h3>{pos.title}</h3>
                                <div className="tags">
                                    {pos.tags.map((tag, i) => (
                                        <span key={i} className={i === 0 ? 'type' : 'location'}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="description">{pos.desc}</p>
                            <div className="skills">
                                {pos.skills.map((skill, i) => (
                                    <span key={i}>{skill}</span>
                                ))}
                            </div>
                            <p className="meta">{pos.meta}</p>
                            <button className="btn">Apply Now <FaPaperPlane style={{ fontSize: '1.3rem' }} /></button>
                        </div>
                    ))}
                </div>
                <p>Don't see the perfect role? We're always looking for talented people!</p>
                <button className="btn">Send Us Your Resume <FaFileAlt /></button>
            </section>

            <section className="benefits-perks">
                <h2>Benefits & Perks</h2>
                <div className="cards">
                    {benefits.map((benefit, idx) => {
                        const IconComponent = benefit.icon;
                        return (
                            <div className="card" key={idx}>
                                <div className="search-icon"><IconComponent /></div>
                                <h3>{benefit.title}</h3>
                                <ul>
                                    {benefit.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="culture-values" id='culture-values'>
                <h2>Our Culture & Values</h2>
                <div className="cards">
                    {values.map((val, idx) => {
                        const IconComponent = val.icon;
                        return (
                            <div className="card" key={idx}>
                                <div className="search-icon"><IconComponent /></div>
                                <h3>{val.title}</h3>
                                <p>{val.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="interview-process">
                <h2>Our Interview Process</h2>
                <ul className="interview-cards">
                    {interviewSteps.map((step, idx) => (
                        <li key={idx}>
                            <h3><span>{step.step}</span> {step.title}</h3>
                            <p>{step.desc}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="form-container" id="join-community-form">
                <h2>Join Our Team</h2>
                <form className="join-form form-base" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input id="name" name="name" type="text" placeholder="Enter your name" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input id="email" name="email" type="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input id="password" name="password" type="password" placeholder="Enter a password" required value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm <br /> Password:</label>
                        <input id="confirm-password" name="confirmPassword" type="password" placeholder="Confirm your password" required value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="preferences">Preferences:</label>
                        <input id="preferences" name="preferences" type="text" placeholder="e.g., Vegan, Gluten-Free" value={formData.preferences} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="terms">
                            <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} required />
                            I agree to the <a href="terms.html">Terms and Conditions</a>
                        </label>
                    </div>
                    <button type="submit">Join Team <FaPaperPlane style={{ fontSize: '1.3rem' }} /></button>
                    {status && <p className="message">{status}</p>}
                </form>
            </section>
        </main>
    );
}

export default Career;