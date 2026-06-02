import {
  BarChart3,
  BriefcaseBusiness,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Sun,
  UserRound
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { initials } from '../utils/formatters';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: BriefcaseBusiness },
  { to: '/board', label: 'Board', icon: KanbanSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound }
];

export const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">JT</div>
          <div>
            <strong>JobTrackr</strong>
            <span>Pipeline CRM</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark">JT</div>
            <span>JobTrackr</span>
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle dark mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-primary" type="button" onClick={() => navigate('/applications/new')}>
              <Plus size={16} />
              New job
            </button>
            <div className="user-chip">
              <div className="avatar">{initials(user?.name)}</div>
              <div>
                <strong>{user?.name}</strong>
                <span>{user?.headline || 'Job seeker'}</span>
              </div>
            </div>
            <button className="icon-btn" type="button" onClick={handleLogout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
