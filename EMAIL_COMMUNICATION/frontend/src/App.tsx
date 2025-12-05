import React, { useEffect, useState, useMemo } from 'react';

interface ThreadSummary {
  id: number;
  name: string;
  email: string;
  category: string;
  status: string;
  latest_summary: string | null;
  created_at: string;
}

interface DailyDashboard {
  date: string;
  summary: any;
  threads: ThreadSummary[];
}

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', width: '300px' }}>
        <h2>Login</h2>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>Login</button>
      </form>
    </div>
  );
};

export const App: React.FC = () => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<DailyDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [threadDetail, setThreadDetail] = useState<any | null>(null);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const isLoggedIn = !!token;

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${apiBase}/api/dashboard/daily?date=${date}`, {
            headers: getAuthHeaders(),
          });
          const json = await res.json();
          setData(json);
        } catch (e: any) {
          setError(e.message || 'Failed to load');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [date, apiBase, isLoggedIn, token]);

  const filteredThreads = useMemo(() => {
    if (!data?.threads) return [];
    return data.threads.filter(thread => {
      const matchesSearch = search === '' || 
        thread.name?.toLowerCase().includes(search.toLowerCase()) || 
        thread.email.toLowerCase().includes(search.toLowerCase()) ||
        thread.latest_summary?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === '' || thread.category === categoryFilter;
      const matchesStatus = statusFilter === '' || thread.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [data?.threads, search, categoryFilter, statusFilter]);

  const openThread = async (id: number) => {
    try {
      const res = await fetch(`${apiBase}/api/threads/${id}`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      setThreadDetail(json);
      setSelectedThread(id);
    } catch (e: any) {
      setError(e.message || 'Failed to load thread');
    }
  };

  const closeThread = () => {
    setSelectedThread(null);
    setThreadDetail(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setData(null);
    setSelectedThread(null);
    setThreadDetail(null);
  };

  const uniqueCategories = useMemo(() => {
    if (!data?.threads) return [];
    return Array.from(new Set(data.threads.map(t => t.category)));
  }, [data?.threads]);

  const uniqueStatuses = useMemo(() => {
    if (!data?.threads) return [];
    return Array.from(new Set(data.threads.map(t => t.status)));
  }, [data?.threads]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setToken(localStorage.getItem('token') || '')} />;
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Email Automation Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
      </div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Date:{' '}
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <input 
          type="text" 
          placeholder="Search by name, email, or summary..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ padding: '0.5rem', minWidth: '200px' }}
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Categories</option>
          {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All Statuses</option>
          {uniqueStatuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedThread ? '1fr 2fr' : '1fr', gap: '1.5rem' }}>
          <div>
            <h2>Today&apos;s Threads ({filteredThreads.length})</h2>
            {filteredThreads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h3>No threads found</h3>
                <p>Try adjusting your search or filters, or check back later for new emails.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Client</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Category</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Status</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Summary</th>
                    <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredThreads.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 4 }}>
                        <div>{t.name || t.email}</div>
                        <div style={{ color: '#666', fontSize: 12 }}>{t.email}</div>
                      </td>
                      <td style={{ padding: 4 }}>{t.category}</td>
                      <td style={{ padding: 4 }}>{t.status}</td>
                      <td style={{ padding: 4 }}>{t.latest_summary || '-'}</td>
                      <td style={{ padding: 4 }}>
                        <button onClick={() => openThread(t.id)} style={{ padding: '0.25rem 0.5rem' }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {selectedThread && threadDetail && (
            <div style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: 4, position: 'relative' }}>
              <button onClick={closeThread} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>×</button>
              <h2>Thread Detail</h2>
              <h3>{threadDetail.thread.subject || 'No subject'}</h3>
              <p>
                <strong>Party:</strong> {threadDetail.thread.party_name || threadDetail.thread.party_email} ({threadDetail.thread.party_email})
              </p>
              <p>
                <strong>Status:</strong> {threadDetail.thread.status} | <strong>Category:</strong> {threadDetail.thread.category}
              </p>
              {threadDetail.extraction && (
                <div style={{ marginTop: '0.5rem' }}>
                  <h4>Final Work Request</h4>
                  <p>{threadDetail.extraction.final_request || 'N/A'}</p>
                  <p>
                    <strong>Work Type:</strong> {threadDetail.extraction.work_type || '-'} | <strong>Budget:</strong>{' '}
                    {threadDetail.extraction.budget || '-'} | <strong>Timeline:</strong> {threadDetail.extraction.timeline || '-'}
                  </p>
                </div>
              )}
              <div style={{ marginTop: '0.75rem' }}>
                <h4>Messages</h4>
                <ul style={{ listStyle: 'none', padding: 0, maxHeight: 400, overflowY: 'auto' }}>
                  {threadDetail.messages.map((m: any) => (
                    <li key={m.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {m.direction} | {m.from_email} → {m.to_email} | {m.sent_at}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{m.cleaned_body || m.raw_body}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
