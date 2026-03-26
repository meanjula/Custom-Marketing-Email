import { Link, useLocation } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import './Header.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/campaigns" className="header-logo">
          <span className="logo-icon"><HiOutlineMail /></span>
          <span className="logo-text">MailCraft</span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/campaigns"
            className={`nav-link ${location.pathname === '/campaigns' ? 'active' : ''}`}
          >
            Campaigns
          </Link>
          <Link
            to="/campaigns/create"
            className={`nav-link ${location.pathname.includes('/create') ? 'active' : ''}`}
          >
            Create Campaign
          </Link>
        </nav>

        <div className="header-actions">
          <div className="avatar">A</div>
        </div>
      </div>
    </header>
  );
}
