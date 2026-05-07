function Navbar() {
  return (
    <div className="card navbar">
      <div className="navbar__brand">
        <a className="navbar__logo" href="#" aria-label="SmartSpend AI home">
          SmartSpend AI
        </a>
        <p className="navbar__tagline">Personal Finance Dashboard</p>
      </div>

      <ul className="navbar__links" aria-label="Dashboard sections">
        <li className="navbar__item">
          <a className="navbar__link" href="#">
            Dashboard
          </a>
        </li>
        <li className="navbar__item">
          <a className="navbar__link" href="#">
            Transactions
          </a>
        </li>
        <li className="navbar__item">
          <a className="navbar__link" href="#">
            AI Advice
          </a>
        </li>
        <li className="navbar__item">
          <a className="navbar__link" href="#">
            Reports
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
