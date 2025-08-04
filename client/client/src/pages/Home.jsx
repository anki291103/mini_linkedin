import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  // Set your backend base URL here
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchPosts();
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/posts`);
      const sortedPosts = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(sortedPosts);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreviewUrl('');
    }
  };

  const handlePost = async e => {
    e.preventDefault();
    try {
      if (!content.trim() && !imageFile) return;

      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.post(
        `${backendUrl}/api/posts`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setContent('');
      setImageFile(null);
      setImagePreviewUrl('');
      document.getElementById('image-upload-input').value = ''; 
      fetchPosts();
    } catch (err) {
      console.error('Error posting:', err.response?.data || err.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="home-page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link className="navbar-brand" to="/">MiniLinkedIn</Link>
          <div className="nav-actions">
            <span className="user-greeting">
              Hello, <Link to={`/profile/${user?._id}`} className="profile-link">{user?.name}</Link>
            </span>
            <Link className="btn btn-outline" to={`/profile/${user?._id}`}>My Profile</Link>
            <button className="btn btn-primary" onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content-wrapper">
        <div className="content-container">
          {/* Post Creation Form */}
          <div className="create-post-card">
            <h5 className="card-title">Create a Post</h5>
            <form onSubmit={handlePost}>
              <textarea
                className="post-textarea"
                rows="4"
                placeholder="What's on your mind? Share an update, a thought, or an achievement."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              {imagePreviewUrl && (
                <div className="post-image-preview">
                  <img src={imagePreviewUrl} alt="Preview" className="preview-image" />
                </div>
              )}
              <div className="post-actions">
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="image-upload-input"
                />
                <label htmlFor="image-upload-input" className="btn btn-outline image-upload-label">
                  Choose Image
                </label>
                <button className="btn btn-primary" type="submit">Post</button>
              </div>
            </form>
          </div>

          {/* Public Feed Section */}
          <h3 className="feed-heading">Public Feed</h3>
          {posts.length === 0 ? (
            <div className="empty-feed-message">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <div className="post-item-card" key={post._id}>
                <div className="post-header">
                  <div className="profile-avatar">
                    {post.author ? post.author.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="post-info">
                    <Link to={`/profile/${post.userId}`} className="post-author-name">{post.author}</Link>
                    <small className="post-timestamp">{formatTimestamp(post.timestamp)}</small>
                  </div>
                </div>
                {post.imageUrl && (
                  <div className="post-image-container">
                    <img src={`${backendUrl}${post.imageUrl}`} alt="Post content" className="post-image" />
                  </div>
                )}
                {post.content && post.content.trim() && <p className="post-content">{post.content}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
