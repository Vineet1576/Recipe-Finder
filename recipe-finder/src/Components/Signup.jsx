import '/public/login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaCheckCircle, FaTimes, FaSignInAlt } from 'react-icons/fa';

function Signup({ onSwitchToLogin, onClose }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !name || !password || !confirmPassword) {
            setError("All Fields are Mandatory");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
            if (res.status === 201) {
                localStorage.setItem("user", JSON.stringify(res.data));
                onClose();
                navigate('/');
                window.dispatchEvent(new Event("storage"));
            } else {
                setError("SignUp Failed");
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setError("User already exists");
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <div className='signup-container'>
            <button className="modal-close" onClick={onClose}><FaTimes /></button>
            <h2><FaUserPlus /> Sign Up</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label><FaUser /> Full Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label><FaEnvelope /> Email Address:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label><FaLock /> Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label><FaCheckCircle /> Confirm Password:</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <p className='error-msg'>{error}</p>
                <button type="submit" className='start-now-btn'><FaUserPlus /> Sign Up</button>
            </form>
            <div className="register-link">
                <p>Already have an account? <a onClick={onSwitchToLogin}><FaSignInAlt /> Login here</a></p>
            </div>
        </div>
    );
}

export default Signup;