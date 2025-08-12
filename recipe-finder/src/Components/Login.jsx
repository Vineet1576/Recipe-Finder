import '/public/login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

function Login({ onSwitchToSignup, onClose }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("All Fields are Mandatory");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            if (res.status === 200) {
                localStorage.setItem("user", JSON.stringify(res.data));
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                }
                onClose();
                navigate('/');
                window.dispatchEvent(new Event("storage"));
            } else {
                setError("Login Failed");
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setError("User does not exist");
            } else if (error.response?.status === 401) {
                setError("Email or password is incorrect");
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <div className='login-container'>
            <button className="modal-close" onClick={onClose}>×</button>
            <h2><FaSignInAlt /> Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <label>Email Address:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className='error-msg'>{error}</p>
                <button type="submit" className='start-now-btn'>Login <FaSignInAlt /></button>
            </form>
            <div className="register-link">
                <p>Don't have an account? <a onClick={onSwitchToSignup}><FaUserPlus /> Sign Up here</a></p>
            </div>
        </div>
    );
}

export default Login;
