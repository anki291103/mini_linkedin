import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Import our new CSS file

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert("Registered successfully");
      navigate('/login');
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="card-title">Join MiniLinkedIn</h2>
        <p className="card-subtitle">Make the most of your professional life.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="name"
              placeholder="Name"
              className="form-input"
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="form-group">
            <textarea
              name="bio"
              placeholder="Short Bio (optional)"
              className="form-input form-textarea"
              onChange={handleChange}
              rows="3"
            />
          </div>
          <button className="register-button" type="submit">Agree & Join</button>
          <p className="login-link-text">
            Already have an account? <Link to="/login" className="login-link">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;