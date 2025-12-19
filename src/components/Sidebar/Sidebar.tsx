import React from "react";
import { Link, useLocation } from "react-router";
import "./Sidebar.css";

interface SidebarProps {
  username: string;
  logoSrc?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username, logoSrc }) => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "fas fa-chart-line" },
    { name: "Objectifs", path: "/goals", icon: "fas fa-bullseye" },
    { name: "Statistiques", path: "/statistics", icon: "fas fa-chart-pie" },
    { name: "Calendrier", path: "/calendar", icon: "fas fa-calendar-alt" },
    { name: "Profil", path: "/profile", icon: "fas fa-user" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="logo-img" />
          ) : (
            <div className="logo-icon">A</div>
          )}
          <h1>Mon App</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <i className={item.icon}></i>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>{username}</h4>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
