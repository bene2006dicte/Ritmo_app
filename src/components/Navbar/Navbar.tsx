import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">Ritmo</div>

      <ul className="nav-links">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/goals">Objectifs</a></li>
        <li><a href="/profile">Profil</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
