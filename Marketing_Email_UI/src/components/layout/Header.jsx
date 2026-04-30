import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineMail } from 'react-icons/hi';
import { logout } from '../../store/authSlice';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

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
          <div className="avatar" title={user?.email}>
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
