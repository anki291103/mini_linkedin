import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  
  // State for post editing
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isMyProfile = currentUser?._id === id;
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchProfile();
  }, [id, navigate, token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/users/${id}`);
      setUserData(res.data.user);
      setForm({ name: res.data.user.name, bio: res.data.user.bio });
      const sortedPosts = res.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserPosts(sortedPosts);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setUserData(null);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${backendUrl}/api/users/${id}`,
        form,
        { headers: { Authorization: token } }
      );
      setUserData(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditing(false);
      console.log('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err.response.data);
    }
  };
  
  const handleEditPost = async (postId) => {
    try {
      if (editedContent.trim() === '') return;
      
      const res = await axios.patch(
        `${backendUrl}/api/posts/${postId}`,
        { content: editedContent },
        { headers: { Authorization: token } }
      );
      
      const updatedPosts = userPosts.map(post => 
        post._id === postId ? { ...post, content: editedContent } : post
      );
      setUserPosts(updatedPosts);
      setEditingPostId(null);
      setEditedContent('');
      
    } catch (err) {
      console.error('Failed to update post:', err.response.data);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `${backendUrl}/api/posts/${postId}`,
        { headers: { Authorization: token } }
      );
      
      const updatedPosts = userPosts.filter(post => post._id !== postId);
      setUserPosts(updatedPosts);
      console.log('Post deleted successfully!');
      
    } catch (err) {
      console.error('Failed to delete post:', err.response.data);
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

  if (!userData) {
    return (
      <div className="profile-loading-container">
        <p className="loading-message">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <nav className="navbar">
        <div className="navbar-container">
          <Link className="navbar-brand" to="/">MiniLinkedIn</Link>
          <div className="nav-actions">
            <span className="user-greeting">
              Hello, <Link to={`/profile/${currentUser?._id}`} className="profile-link-nav">{currentUser?.name}</Link>
            </span>
            <Link className="btn btn-outline" to={`/profile/${currentUser?._id}`}>My Profile</Link>
            <button className="btn btn-primary" onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content-wrapper">
        <div className="profile-content-container">
          {isEditing ? (
            <div className="profile-card edit-card">
              <h3 className="card-title">Edit Profile</h3>
              <form onSubmit={handleEdit} className="edit-form">
                <div className="avatar-edit-container">
                  <div className="profile-avatar-initials">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input form-textarea"
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows="4"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="profile-card view-card">
                <div className="profile-header">
                  <div className="profile-avatar-initials">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h2 className="profile-name">{userData.name}</h2>
                    <p className="profile-email">{userData.email}</p>
                    <p className="profile-bio">{userData.bio || 'No bio available'}</p>
                    {isMyProfile && (
                      <button className="btn btn-outline edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="feed-heading">Posts by {userData.name}</h3>
              {userPosts.length === 0 ? (
                <div className="empty-feed-message">
                  <p>This user hasn't posted yet.</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <div className="post-item-card" key={post._id}>
                    <div className="post-header">
                      <div className="profile-avatar-small">
                        {post.author ? post.author.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="post-info">
                        <span className="post-author-name">{post.author}</span>
                        <small className="post-timestamp">{formatTimestamp(post.createdAt)}</small>
                      </div>
                    </div>
                    {post.imageUrl && (
                      <div className="post-image-container">
                        <img src={`${backendUrl}${post.imageUrl}`} alt="Post content" className="post-image" />
                      </div>
                    )}
                    
                    {isMyProfile && editingPostId === post._id ? (
                      <div className="edit-post-form">
                        <textarea
                          className="post-textarea"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows="3"
                        />
                        <div className="form-actions-small">
                          <button
                            className="btn btn-outline"
                            onClick={() => {
                              setEditingPostId(null);
                              setEditedContent('');
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditPost(post._id)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="post-content-section">
                        {post.content && post.content.trim() && <p className="post-content">{post.content}</p>}
                        {isMyProfile && (
                          <div className="post-action-buttons">
                            <button
                              className="btn-edit-post"
                              onClick={() => {
                                setEditingPostId(post._id);
                                setEditedContent(post.content);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete-post"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
