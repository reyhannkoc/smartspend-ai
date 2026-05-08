function Navbar() {
  return (
    <div className="card navbar">
      <div className="navbar__brand">
        <a className="navbar__logo" href="#" aria-label="SmartSpend AI home">
          SmartSpend AI
        </a>
        <p className="navbar__tagline">Personal Finance Dashboard</p>
      </div>

      <span className="navbar__meta" aria-label="Dashboard mode">
        Demo Mode
      </span>
    </div>
  )
}

export default Navbar
