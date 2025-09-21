import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [username, setUsername] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({});

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/Dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
        
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUsername(payload.username || 'User');
        } catch (e) {
          console.log('Could not decode token:', e);
        }
      } else {
        setError('Failed to load sessions');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const downloadReport = async (sessionId, assessmentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      return;
    }

    setLoading({...loading, [sessionId]: true});
    setError('');

    try {
      const response = await fetch('http://localhost:5000/user/report/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sessionId}_${assessmentId}_Report.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to generate report');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading({...loading, [sessionId]: false});
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getAssessmentName = (assessmentId) => {
    switch(assessmentId) {
      case 'as_hr_02': return 'Health & Fitness';
      case 'as_card_01': return 'Cardiac';
      default: return assessmentId;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome, {username}!</h1>
              <p className="opacity-90">View and download your assessment reports</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors mt-4 sm:mt-0"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Assessment Sessions</h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No assessment sessions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.session_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-medium text-gray-900">Session: {session.session_id}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getAssessmentName(session.assessment_id)}
                        </span>
                        <span className="mx-2">•</span>
                        Accuracy: {session.accuracy}%
                        {session.timestamp && (
                          <>
                            <span className="mx-2">•</span>
                            {formatDate(session.timestamp)}
                          </>
                        )}
                        {session.gender && (
                          <>
                            <span className="mx-2">•</span>
                            {session.gender}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => downloadReport(session.session_id, session.assessment_id)}
                      disabled={loading[session.session_id]}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading[session.session_id] ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        'Download Report'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}