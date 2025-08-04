import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the new CSS file

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("Logged in");
      navigate('/');
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="card-title">MiniLinkedIn</h2>
        <p className="card-subtitle">Stay connected with your professional world.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="email"
              placeholder="Email address"
              className="form-input"
              type="email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              placeholder="Password"
              className="form-input"
              type="password"
              onChange={handleChange}
              required
            />
          </div>
          <button className="login-button" type="submit">Sign In</button>
          <div className="divider"></div>
          <p className="register-link-text">
            New to MiniLinkedIn? <Link to="/register" className="register-link">Join now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;