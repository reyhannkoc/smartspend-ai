const sidebarItems = [
  { href: '#dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '#transactions', label: 'Transactions', icon: '🧾' },
  { href: '#reports', label: 'Reports', icon: '📊' },
  { href: '#investment-suggestions', label: 'Investment Suggestions', icon: '📈' },
  { href: '#account-section', label: 'Account', icon: '👤' },
  { href: '#settings-section', label: 'Settings', icon: '⚙️' },
]

function Sidebar({ onLogout, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <aside className="dashboard-sidebar card" aria-label="Sidebar menu">
      <div className="dashboard-sidebar__brand">
        <p className="dashboard-sidebar__eyebrow">SmartSpend</p>
        <h1 className="dashboard-sidebar__title">Control Center</h1>
      </div>

      <nav className="dashboard-sidebar__nav" aria-label="Dashboard quick links">
        {sidebarItems.map((item) => (
          <a key={item.label} className="dashboard-sidebar__link" href={item.href}>
            <span className="dashboard-sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="dashboard-sidebar__link-text">{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="dashboard-sidebar__theme-toggle"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="dashboard-sidebar__theme-icon" aria-hidden="true">
          {isDark ? '☀️' : '🌙'}
        </span>
        <span className="dashboard-sidebar__theme-label">
          {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </span>
      </button>

      <div className="dashboard-sidebar__logout-wrap">
        <button
          type="button"
          className="dashboard-sidebar__logout"
          onClick={onLogout}
          aria-label="Log out of SmartSpend AI"
        >
          <span className="dashboard-sidebar__logout-icon" aria-hidden="true">🚪</span>
          <span className="dashboard-sidebar__logout-text">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
