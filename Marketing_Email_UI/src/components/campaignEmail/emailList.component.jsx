import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCampaigns } from '../../store/campaignSlice';
import EmailRow from './emailRow.component';
import './CampaignEmail.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: '0', label: 'Draft' },
  { value: '1', label: 'Sent' },
];

export default function EmailListComponent() {
  const dispatch = useDispatch();
  const { campaigns, loading, error } = useSelector((state) => state.campaign);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = campaigns
    .filter((c) => {
      const matchSearch =
        (c.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (c.subject ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === '' || String(c.status) === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const sortIcon = (field) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const sentCount = campaigns.filter((c) => c.status === 1).length;
  const draftCount = campaigns.filter((c) => c.status === 0).length;

  if (loading) return <div className="page-loading">Loading campaigns…</div>;
  if (error) return <div className="page-error">Failed to load campaigns: {error}</div>;

  return (
    <div className="email-list-page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Manage and track all your email campaigns.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}>
          + Create Campaign
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <StatCard label="Total" value={campaigns.length} icon="📧" color="blue"/>
        <StatCard label="Sent" value={sentCount} icon="✅" color="green" />
        <StatCard label="Drafts" value={draftCount} icon="📝" color="orange" />
      </div>

      {/* Filters */}
      <div className="list-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No campaigns found</h3>
          <p>{search || statusFilter ? 'Try adjusting your filters.' : 'Create your first campaign to get started.'}</p>
          {!search && !statusFilter && (
            <button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}>
              Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="campaign-table">
            <thead>
              <tr>
                <th className="th" onClick={() => handleSort('name')}>
                  Campaign Name {sortIcon('name')}
                </th>
                <th className="th" onClick={() => handleSort('subject')}>
                  Subject {sortIcon('subject')}
                </th>
                <th className="th" onClick={() => handleSort('status')}>
                  Status {sortIcon('status')}
                </th>
                <th className="th" onClick={() => handleSort('created')}>
                  Created {sortIcon('created')}
                </th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campaign) => (
                <EmailRow key={campaign.id} campaign={campaign} />
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            Showing {filtered.length} of {campaigns.length} campaigns
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card ${color ? `stat-${color}` : ''}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
