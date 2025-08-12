import React from 'react'
import { FaUsers, FaBookOpen, FaComments, FaStar, FaCalendarAlt, FaHeart } from 'react-icons/fa';
function Info() {
    const stats = [
        { icon: <FaUsers />, value: '50K+', label: 'Active Members' },
        { icon: <FaBookOpen />, value: '10K+', label: 'Recipes Shared' },
        { icon: <FaComments />, value: '5K+', label: 'Discussions Started' },
        { icon: <FaStar />, value: '4.9/5', label: 'Average Rating' },
        { icon: <FaCalendarAlt />, value: 'Weekly', label: 'Events Hosted' },
        { icon: <FaHeart />, value: '100%', label: 'Community Satisfaction' },
    ];
    return (
        <section className="community-intro">
            <h2>Welcome to the Recipe Finder Community</h2>
            <p>Our community is a vibrant space for food lovers to connect, share, and inspire each other. Whether you're a seasoned chef or just starting out, you'll find a welcoming environment to explore new recipes and cooking techniques.</p>
            <div className="cards">
                {stats.map((stat, i) => (
                    <div className="card" key={i}>
                        <h2><span className="search-icon">{stat.icon}</span> {stat.value}</h2>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Info
