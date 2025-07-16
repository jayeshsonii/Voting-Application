import React, { useState, useEffect, useCallback } from 'react';

// Helper function for making authenticated API calls
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  return response;
};

// Message Modal Component
const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? '#28a745' : '#dc3545'; // Green for success, Red for error
  const borderColor = type === 'success' ? '#218838' : '#c82333';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        padding: '25px', borderRadius: '10px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', // Enhanced shadow
        backgroundColor: bgColor, color: 'white', border: `2px solid ${borderColor}`,
        maxWidth: '350px', margin: 'auto', textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '20px' }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px', backgroundColor: 'white', color: '#333',
            borderRadius: '6px', border: 'none', cursor: 'pointer',
            fontSize: '1em', fontWeight: '600',
            transition: 'background-color 0.3s, transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e2e6ea'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Auth Forms Component (Login & Signup)
const AuthForms = ({ onLoginSuccess, showMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    aadharCardNumber: '',
    password: '',
    role: 'voter',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:3000/user/login' : 'http://localhost:3000/user/signup';
    const method = 'POST';
    const payload = isLogin
      ? { aadharCardNumber: parseInt(formData.aadharCardNumber), password: formData.password }
      : {
          name: formData.name,
          age: parseInt(formData.age),
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          aadharCardNumber: parseInt(formData.aadharCardNumber),
          password: formData.password,
          role: formData.role,
        };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.token);
        showMessage(isLogin ? 'Login successful!' : 'Signup successful!', 'success');
      } else {
        showMessage(data.error || data.message || 'Authentication failed', 'error');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      showMessage('Network error or server unreachable', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '2.2em', fontWeight: '700', textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          {isLogin ? 'Login to Vote' : 'Create Account'}
        </h2>
        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Email (Optional):</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Mobile (Optional):</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em', appearance: 'none', background: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-6.5%200-12.3%203.2-16.1%208.1-3.8%204.9-4.8%2011.5-2.7%2017.2l139.2%20139.2c3.8%203.8%209%205.9%2014.5%205.9s10.7-2.1%2014.5-5.9L289.8%2095.7c2.1-5.7%201.1-12.3-2.7-17.2z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center / 12px auto' }}
                >
                  <option value="voter">Voter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Aadhar Card Number:</label>
            <input
              type="number"
              name="aadharCardNumber"
              value={formData.aadharCardNumber}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
              required
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1em', fontWeight: '700', transition: 'background-color 0.3s, transform 0.2s', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#666', marginTop: '25px', fontSize: '0.9em' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin((prev) => !prev)}
            style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '1em', padding: 0 }}
          >
            {isLogin ? 'Signup here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Dashboard Component (Voter View)
const Dashboard = ({ user, showMessage, onVoteSuccess }) => {
  const [candidates, setCandidates] = useState([]);
  const [voteCounts, setVoteCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://localhost:3000/candidate');
      const data = await response.json();
      if (response.ok) {
        setCandidates(data);
      } else {
        showMessage(data.error || 'Failed to fetch candidates', 'error');
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      showMessage('Network error while fetching candidates', 'error');
    }
  }, [showMessage]);

  const fetchVoteCounts = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://localhost:3000/candidate/vote/counts');
      const data = await response.json();
      if (response.ok) {
        setVoteCounts(data);
      } else {
        showMessage(data.error || 'Failed to fetch vote counts', 'error');
      }
    } catch (error) {
      console.error('Error fetching vote counts:', error);
      showMessage('Network error while fetching vote counts', 'error');
    }
  }, [showMessage]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCandidates();
      await fetchVoteCounts();
      setLoading(false);
    };
    loadData();
  }, [fetchCandidates, fetchVoteCounts, user?.isVoted]); // Re-fetch if user votes

  const handleVote = async (candidateId) => {
    if (user.isVoted) {
      showMessage('You have already voted!', 'error');
      return;
    }
    try {
      const response = await fetchWithAuth(`http://localhost:3000/candidate/vote/${candidateId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        onVoteSuccess(); // Trigger App.js to re-fetch user profile and update isVoted status
      } else {
        showMessage(data.message || data.error || 'Failed to record vote', 'error');
      }
    } catch (error) {
      console.error('Error voting:', error);
      showMessage('Network error while voting', 'error');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '30px', color: '#555', fontSize: '1.1em' }}>Loading candidates and vote counts...</div>;
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '2.5em', fontWeight: '700', textAlign: 'center', color: '#333', marginBottom: '40px' }}>Voting Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Candidates List */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Available Candidates</h3>
          {candidates.length === 0 ? (
            <p style={{ color: '#666', fontSize: '1em' }}>No candidates available yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {candidates.map((candidate) => (
                <li key={candidate._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
                  <div>
                    <p style={{ fontSize: '1.1em', fontWeight: '600', color: '#333', margin: 0 }}>{candidate.name}</p>
                    <p style={{ fontSize: '0.9em', color: '#666', margin: '5px 0 0' }}>{candidate.party}</p>
                  </div>
                  {user?.role === 'voter' && (
                    <button
                      onClick={() => handleVote(candidate._id)}
                      disabled={user?.isVoted}
                      style={{
                        padding: '10px 22px', borderRadius: '25px', fontWeight: '600', transition: 'all 0.3s',
                        backgroundColor: user?.isVoted ? '#6c757d' : '#007bff', // Gray if voted, Blue if not
                        color: 'white', border: 'none', cursor: user?.isVoted ? 'not-allowed' : 'pointer',
                        boxShadow: user?.isVoted ? 'none' : '0 4px 10px rgba(0,123,255,0.2)'
                      }}
                      onMouseOver={(e) => { if (!user?.isVoted) e.target.style.backgroundColor = '#0056b3'; }}
                      onMouseOut={(e) => { if (!user?.isVoted) e.target.style.backgroundColor = '#007bff'; }}
                    >
                      {user?.isVoted ? 'Voted' : 'Vote'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Live Vote Counts */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Live Vote Counts</h3>
          {voteCounts.length === 0 ? (
            <p style={{ color: '#666', fontSize: '1em' }}>No votes recorded yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {voteCounts.map((vote, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '1.1em', fontWeight: '600', color: '#333', margin: 0 }}>{vote.party}</p>
                  <span style={{ fontSize: '1.3em', fontWeight: '700', color: '#007bff' }}>{vote.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ showMessage, refreshCandidates }) => {
  const [candidateForm, setCandidateForm] = useState({ name: '', party: '', age: '' });
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [candidates, setCandidates] = useState([]); // To populate dropdowns

  const fetchAllCandidatesForAdmin = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://localhost:3000/candidate');
      const data = await response.json();
      if (response.ok) {
        setCandidates(data);
      } else {
        showMessage(data.error || 'Failed to fetch candidates for admin', 'error');
      }
    } catch (error) {
      console.error('Error fetching candidates for admin:', error);
      showMessage('Network error while fetching candidates for admin', 'error');
    }
  }, [showMessage]);

  useEffect(() => {
    fetchAllCandidatesForAdmin();
  }, [fetchAllCandidatesForAdmin]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCandidateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth('http://localhost:3000/candidate', {
        method: 'POST',
        body: JSON.stringify({ ...candidateForm, age: parseInt(candidateForm.age) }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Candidate added successfully!', 'success');
        setCandidateForm({ name: '', party: '', age: '' });
        fetchAllCandidatesForAdmin(); // Refresh list
        refreshCandidates(); // Notify Dashboard to refresh
      } else {
        showMessage(data.message || data.error || 'Failed to add candidate', 'error');
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      showMessage('Network error while adding candidate', 'error');
    }
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      showMessage('Please select a candidate to update.', 'error');
      return;
    }
    try {
      const response = await fetchWithAuth(`http://localhost:3000/candidate/${selectedCandidateId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...candidateForm, age: parseInt(candidateForm.age) }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Candidate updated successfully!', 'success');
        setCandidateForm({ name: '', party: '', age: '' });
        setSelectedCandidateId('');
        fetchAllCandidatesForAdmin(); // Refresh list
        refreshCandidates(); // Notify Dashboard to refresh
      } else {
        showMessage(data.message || data.error || 'Failed to update candidate', 'error');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      showMessage('Network error while updating candidate', 'error');
    }
  };

  const handleDeleteCandidate = async () => {
    if (!selectedCandidateId) {
      showMessage('Please select a candidate to delete.', 'error');
      return;
    }
    try {
      const response = await fetchWithAuth(`http://localhost:3000/candidate/${selectedCandidateId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Candidate deleted successfully!', 'success');
        setSelectedCandidateId('');
        fetchAllCandidatesForAdmin(); // Refresh list
        refreshCandidates(); // Notify Dashboard to refresh
      } else {
        showMessage(data.message || data.error || 'Failed to delete candidate', 'error');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      showMessage('Network error while deleting candidate', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '2.5em', fontWeight: '700', textAlign: 'center', color: '#333', marginBottom: '40px' }}>Admin Panel</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Add Candidate */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Add New Candidate</h3>
          <form onSubmit={handleAddCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Name:</label>
              <input
                type="text"
                name="name"
                value={candidateForm.name}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Party:</label>
              <input
                type="text"
                name="party"
                value={candidateForm.party}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Age:</label>
              <input
                type="number"
                name="age"
                value={candidateForm.age}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1em', fontWeight: '700', transition: 'background-color 0.3s, transform 0.2s', boxShadow: '0 4px 10px rgba(40,167,69,0.2)' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              Add Candidate
            </button>
          </form>
        </div>

        {/* Update Candidate */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Update Candidate</h3>
          <form onSubmit={handleUpdateCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Select Candidate:</label>
              <select
                value={selectedCandidateId}
                onChange={(e) => {
                  setSelectedCandidateId(e.target.value);
                  const selected = candidates.find(c => c._id === e.target.value);
                  if (selected) {
                    setCandidateForm({ name: selected.name, party: selected.party, age: selected.age });
                  } else {
                    setCandidateForm({ name: '', party: '', age: '' });
                  }
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em', appearance: 'none', background: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-6.5%200-12.3%203.2-16.1%208.1-3.8%204.9-4.8%2011.5-2.7%2017.2l139.2%20139.2c3.8%203.8%209%205.9%2014.5%205.9s10.7-2.1%2014.5-5.9L289.8%2095.7c2.1-5.7%201.1-12.3-2.7-17.2z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center / 12px auto' }}
              >
                <option value="">-- Select --</option>
                {candidates.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.party})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Name:</label>
              <input
                type="text"
                name="name"
                value={candidateForm.name}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Party:</label>
              <input
                type="text"
                name="party"
                value={candidateForm.party}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Age:</label>
              <input
                type="number"
                name="age"
                value={candidateForm.age}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '15px', backgroundColor: '#ffc107', color: '#333', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1em', fontWeight: '700', transition: 'background-color 0.3s, transform 0.2s', boxShadow: '0 4px 10px rgba(255,193,7,0.2)' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
            >
              Update Candidate
            </button>
          </form>
        </div>

        {/* Delete Candidate */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Delete Candidate</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Select Candidate:</label>
              <select
                value={selectedCandidateId}
                onChange={(e) => {
                  setSelectedCandidateId(e.target.value);
                  setCandidateForm({ name: '', party: '', age: '' }); // Clear form when selecting for delete
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em', appearance: 'none', background: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-6.5%200-12.3%203.2-16.1%208.1-3.8%204.9-4.8%2011.5-2.7%2017.2l139.2%20139.2c3.8%203.8%209%205.9%2014.5%205.9s10.7-2.1%2014.5-5.9L289.8%2095.7c2.1-5.7%201.1-12.3-2.7-17.2z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center / 12px auto' }}
              >
                <option value="">-- Select --</option>
                {candidates.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.party})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDeleteCandidate}
              style={{ width: '100%', padding: '15px', backgroundColor: '#dc3545', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1em', fontWeight: '700', transition: 'background-color 0.3s, transform 0.2s', boxShadow: '0 4px 10px rgba(220,53,69,0.2)' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Delete Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Profile Component
const UserProfile = ({ user, showMessage, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth('http://localhost:3000/user/profile/password', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        setFormData({ currentPassword: '', newPassword: '' }); // Clear form
        onProfileUpdate(); // Trigger App.js to re-fetch user profile
      } else {
        showMessage(data.error || data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('Network error while changing password', 'error');
    }
  };

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '30px', color: '#555', fontSize: '1.1em' }}>Loading user profile...</div>;
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '2.5em', fontWeight: '700', textAlign: 'center', color: '#333', marginBottom: '40px' }}>Your Profile</h2>

      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', width: '100%', maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Personal Information</h3>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Name:</span> {user.name}</p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Age:</span> {user.age}</p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Email:</span> {user.email || 'N/A'}</p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Mobile:</span> {user.mobile || 'N/A'}</p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Address:</span> {user.address}</p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Aadhar Card Number:</span> {user.aadharCardNumber}</p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Role:</span> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
          <p style={{ color: '#444', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ fontWeight: '600' }}>Voted:</span> {user.isVoted ? 'Yes' : 'No'}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontSize: '0.95em', fontWeight: '600', marginBottom: '8px' }}>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1em' }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1em', fontWeight: '700', transition: 'background-color 0.3s, transform 0.2s', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'login', 'dashboard', 'admin', 'profile'
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const closeMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setCurrentPage('login');
      return;
    }
    try {
      const response = await fetchWithAuth('http://localhost:3000/user/profile');
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setCurrentPage('dashboard'); // Default to dashboard after successful profile fetch
      } else {
        showMessage(data.error || 'Failed to fetch profile. Please login again.', 'error');
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
        setCurrentPage('login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('Network error while fetching profile. Please login again.', 'error');
      setToken(null);
      localStorage.removeItem('token');
      setUser(null);
      setCurrentPage('login');
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // fetchProfile will be called by useEffect due to token change
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    showMessage('Logged out successfully!', 'success');
    setCurrentPage('login');
  };

  const handleVoteSuccess = () => {
    fetchProfile(); // Re-fetch user profile to update isVoted status
  };

  const handleCandidateRefresh = () => {
    // This function can be passed to AdminPanel to trigger dashboard refresh
    // For now, Dashboard already re-fetches on user.isVoted change, but this is a placeholder
    // for more explicit refreshes if needed.
    console.log("Admin action completed, consider refreshing dashboard data.");
    // Force re-fetch candidates and vote counts on dashboard
    setCurrentPage('dashboard'); // Navigate to dashboard to trigger its useEffect
  };


  return (
    // Global style for body to remove margin and padding
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            font-family: "Inter", sans-serif;
          }
        `}
      </style>
      <div style={{ fontFamily: 'Arial, sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', backgroundColor: '#f0f2f5' }}>
        <MessageModal message={message} type={messageType} onClose={closeMessage} />

        {token && user ? (
          <nav style={{ backgroundColor: '#007bff', padding: '15px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
              <h1 style={{ color: 'white', fontSize: '1.6em', fontWeight: '700', margin: 0 }}>Voting App</h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  style={{
                    padding: '10px 18px', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s',
                    backgroundColor: currentPage === 'dashboard' ? '#0056b3' : 'transparent',
                    color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95em',
                  }}
                  onMouseOver={(e) => { if (currentPage !== 'dashboard') e.target.style.backgroundColor = '#0056b3'; }}
                  onMouseOut={(e) => { if (currentPage !== 'dashboard') e.target.style.backgroundColor = 'transparent'; }}
                >
                  Dashboard
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    style={{
                      padding: '10px 18px', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s',
                      backgroundColor: currentPage === 'admin' ? '#0056b3' : 'transparent',
                      color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95em',
                    }}
                    onMouseOver={(e) => { if (currentPage !== 'admin') e.target.style.backgroundColor = '#0056b3'; }}
                    onMouseOut={(e) => { if (currentPage !== 'admin') e.target.style.backgroundColor = 'transparent'; }}
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage('profile')}
                  style={{
                    padding: '10px 18px', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s',
                    backgroundColor: currentPage === 'profile' ? '#0056b3' : 'transparent',
                    color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95em',
                  }}
                  onMouseOver={(e) => { if (currentPage !== 'profile') e.target.style.backgroundColor = '#0056b3'; }}
                  onMouseOut={(e) => { if (currentPage !== 'profile') e.target.style.backgroundColor = 'transparent'; }}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 18px', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s',
                    backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95em',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        ) : null}

        <main>
          {!token || !user ? (
            <AuthForms onLoginSuccess={handleLoginSuccess} showMessage={showMessage} />
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <Dashboard user={user} showMessage={showMessage} onVoteSuccess={handleVoteSuccess} />
              )}
              {currentPage === 'admin' && user.role === 'admin' && (
                <AdminPanel showMessage={showMessage} refreshCandidates={handleCandidateRefresh} />
              )}
              {currentPage === 'profile' && (
                <UserProfile user={user} showMessage={showMessage} onProfileUpdate={fetchProfile} />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
