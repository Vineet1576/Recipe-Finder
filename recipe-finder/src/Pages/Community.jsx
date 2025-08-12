import '/public/community.css';
import Info from '../Components/Info';
import { FaUsers, FaUtensils, FaComments, FaStar, FaBell, FaHeart, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Community() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        preferences: '',
        role: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const features = [
        { icon: <FaUsers />, title: 'Connect with Food Lovers', desc: 'Meet fellow food enthusiasts, share your culinary experiences, and make new friends.' },
        { icon: <FaUtensils />, title: 'Share Your Recipes', desc: 'Post your favorite recipes, get feedback, and inspire others with your cooking skills.' },
        { icon: <FaComments />, title: 'Engage in Discussions', desc: 'Join lively discussions on cooking techniques, ingredient swaps, and meal planning tips.' },
        { icon: <FaStar />, title: 'Exclusive Content', desc: 'Access exclusive recipes, cooking tips, and community events that are only available to members.' },
        { icon: <FaBell />, title: 'Stay Updated', desc: 'Get the latest news on food trends, new recipes, and community highlights delivered to your inbox.' },
        { icon: <FaHeart />, title: 'Support Each Other', desc: 'Share your cooking challenges and successes, and receive encouragement from a supportive community.' },
    ];

    const activities = [
        { label: 'Monthly Challenges:', desc: 'Compete in themed cooking challenges and win exciting prizes' },
        { label: 'Discussion Forums:', desc: 'Ask questions, share tips, and discuss all things culinary' },
        { label: 'Photo Sharing:', desc: 'Show off your culinary creations and get feedback from the community' },
        { label: 'Live Events:', desc: 'Join live cooking sessions and Q&A with professional chefs' },
        { label: 'Weekly Newsletters:', desc: 'Stay updated with the latest recipes, tips, and community highlights' },
        { label: 'Collaboration Opportunities:', desc: 'Work with other members on collaborative cooking projects' },
    ];

    const members = [
        {
            img: 'https://tse4.mm.bing.net/th/id/OIP.ZMchFmIjm68D-bK6qH1UjAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
            name: 'Jansen Huang',
            role: 'Food Blogger & Recipe Developer',
            bio: '"Jane is a passionate home cook who loves experimenting with new recipes and sharing her culinary adventures with the community."'
        },
        {
            img: 'https://nettv4u.com/fileman/Uploads/Yash-As-A-Real-Life-Hero/yash1.jpg',
            name: 'Yash',
            role: 'Professional Chef & Culinary Instructor',
            bio: '"John brings his professional culinary expertise to the community, offering valuable tips and techniques to aspiring cooks."'
        },
        {
            img: 'https://th.bing.com/th/id/R.07890089f32cd78061f56a4883133814?rik=Gqx%2f5%2blIcKo%2bsQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-UpTLoNXVBOA%2fUhBNW4oJsoI%2fAAAAAAAAoyg%2f0itL3CCtGJY%2fs1600%2fPrabhas%2bHD%2bWallpapers%2b3.jpg&ehk=8owZnCSXlK6IQY56z3m%2fI8B7tpkGbbms2JMmle22iUY%3d&risl=&pid=ImgRaw&r=0',
            name: 'Prabhas',
            role: 'Home Cook & Food Photographer',
            bio: '"Emily combines her love for cooking with stunning food photography, inspiring others to create beautiful dishes."'
        },
        {
            img: 'https://tse1.mm.bing.net/th/id/OIP.wKz4AUJUvAK_8PJI6A5SRgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
            name: 'Bill Gates',
            role: 'Nutritionist & Healthy Cooking Advocate',
            bio: '"Michael shares his knowledge of nutrition and healthy cooking, helping members make informed food choices."'
        },
        {
            img: 'https://i.pravatar.cc/150?img=1',
            name: 'Sarah Wilson',
            role: 'Vegan Chef & Plant-Based Cooking Enthusiast',
            bio: '"Sarah is passionate about plant-based cooking and shares delicious vegan recipes that everyone can enjoy."'
        },
        {
            img: 'https://i.pravatar.cc/150?img=2',
            name: 'David Lee',
            role: 'Head Chef & Plant-Based Cooking Enthusiast',
            bio: '"Michael shares his knowledge of nutrition and healthy cooking, helping members make informed food choices."'
        },
    ];

    const guidelines = [
        { icon: <FaCheck />, strong: 'Be respectful', desc: 'Treat all community members with kindness and respect, regardless of skill level or background.' },
        { icon: <FaCheck />, strong: 'Share responsibly', desc: 'Post original content and give credit to others when sharing recipes or ideas.' },
        { icon: <FaCheck />, strong: 'Stay on topic', desc: 'Keep discussions relevant to cooking, recipes, and food-related topics.' },
        { icon: <FaTimes />, strong: 'No spam or promotions', desc: 'Avoid posting spam, self-promotion, or irrelevant links. This community is for sharing and learning, not advertising.' },
        { icon: <FaCheck />, strong: 'Be supportive', desc: 'Encourage and uplift fellow members. Share constructive feedback and celebrate each other\'s successes.' },
        { icon: <FaCheck />, strong: 'Report issues', desc: 'If you see any inappropriate content or behavior, please report it to the community moderators immediately.' },
        { icon: <FaCheck />, strong: 'Have fun!', desc: 'Enjoy the process of cooking, sharing, and learning together.' },
        { icon: <FaTimes />, strong: 'No Offensive Content', desc: 'Keep discussions family-friendly and avoid controversial topics unrelated to cooking.' },
        { icon: <FaCheck />, strong: 'Respect Privacy', desc: 'Do not share personal information without consent. Respect the privacy of all community members.' },
        { icon: <FaTimes />, strong: 'No False Information', desc: 'Ensure recipe instructions are accurate and safe for others to follow.' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJoinCommunity = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.role) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const response = await axios.post('http://localhost:5000/api/community/register', formData);

            if (response.status === 201) {
                // Store user data and token in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                
                alert('Registration successful! Welcome to the community!');
                setShowModal(false);
                
                // Navigate to members page
                navigate('/members');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <section className="community-header">
                <h1><FaUsers /> Join Our Culinary Community</h1>
                <h3 className="community-subtitle"><FaUtensils /> Connect, Share, and Grow with Food Lovers Worldwide</h3>
                <p className="community-mission" style={{maxWidth: '700px', margin: '0 auto'}}><FaHeart /> "Our mission is to inspire and empower everyone to cook, share, and celebrate food together. Whether you're a beginner or a seasoned chef, you'll find support, inspiration, and friendship here."</p>
                <div className="community-cta">
                    <a className="start-now-btn" aria-label="Join Community" onClick={() => setShowModal(true)}>
                        <FaUsers /> Join Community
                    </a>
                </div>
            </section>

            {/* Join Community Modal */}
            {showModal && (
                <div className="community-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="community-modal" onClick={e => e.stopPropagation()}>
                        <span className="close-community-modal" onClick={() => setShowModal(false)} aria-label="Close Modal" role="button" tabIndex={0}><FaTimes /></span>
                        <h2><FaUsers /> Join Our Community</h2>
                        <form className="community-join-form" onSubmit={handleJoinCommunity}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    placeholder="Enter your full name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username *</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    placeholder="Choose a username" 
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    placeholder="Create a password" 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="preferences">Cooking Preferences</label>
                                <input 
                                    type="text" 
                                    id="preferences" 
                                    name="preferences" 
                                    placeholder="e.g. vegetarian, quick, healthy" 
                                    value={formData.preferences}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role *</label>
                                <select 
                                    id="role" 
                                    name="role" 
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select your role</option>
                                    <option value="home-cook">Home Cook</option>
                                    <option value="chef">Chef</option>
                                    <option value="nutritionist">Nutritionist</option>
                                    <option value="food-blogger">Food Blogger</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Short Bio</label>
                                <textarea 
                                    id="bio" 
                                    name="bio" 
                                    placeholder="Tell us a little about yourself..." 
                                    rows={3} 
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {error && <div className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}
                            <button
                                type="submit" 
                                className="start-now-btn"
                                disabled={loading}
                            >
                                {loading ? 'Joining...' : <><FaUsers /> Join Now</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <Info />
            <section className="community-features">
                <h2><FaStar /> Why Join Our Community?</h2>
                <p><FaBell /> As a member, you'll enjoy exclusive benefits that enhance your cooking journey:</p>
                <div className="cards">
                    {features.map((feature, i) => (
                        <div className="card" key={i}>
                            <span className="search-icon">{feature.icon}</span>
                            <h2>{feature.title}</h2>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="meal-planner-tips">
                <h2><FaUtensils /> Community Activities</h2>
                <p><FaComments /> Join our weekly cooking challenges, live Q&A sessions with chefs, and themed recipe contests. Whether you're looking to improve your skills or just have fun, there's something for everyone!</p>
                <ul className="tips">
                    {activities.map((act, i) => (
                        <li key={i}><FaCheck /> <strong>{act.label}</strong> {act.desc}</li>
                    ))}
                </ul>
            </section>
            <section className="community-members">
                <h2><FaUsers /> Our Active Members</h2>
                <p><FaHeart /> Meet some of our most active members who contribute regularly to the community. Their passion for cooking and sharing knowledge makes our community vibrant and inspiring.</p>
                <div className="cards">
                    {members.map((member, i) => (
                        <div className="card" key={i}>
                            <div className="info">
                                <img src={member.img} alt="Member Photo" />
                                <h3>{member.name}</h3>
                            </div>
                            <h4>{member.role}</h4>
                            <p className="member-bio">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="meal-planner-tips">
                <h2><FaExclamationTriangle /> Community Guidelines</h2>
                <p><FaBell /> To maintain a positive and respectful environment, we ask all members to follow these guidelines:</p>
                <ul className="tips">
                    {guidelines.map((g, i) => (
                        <li key={i}>{g.icon} <strong>{g.strong}</strong><br />{g.desc}</li>
                    ))}
                </ul>
                <p><FaCheck /> By joining our community, you agree to adhere to these guidelines and help us create a welcoming space for all everyone.</p>
            </section>
        </main>
    );
}

export default Community