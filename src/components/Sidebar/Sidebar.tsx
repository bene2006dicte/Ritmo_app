import { Link, useLocation } from 'react-router';
import { 
    Home, 
    Target, 
    Calendar, 
    ChartLine, // Icône Statistiques de la maquette
    User 
} from 'lucide-react'; 
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    
    // Récupération dynamique du nom depuis le localStorage (clé 'user_name')
    // Tu devras t'assurer que lors du login/register, tu fais : localStorage.setItem('user_name', name)
    const userName = localStorage.getItem('user_name') || "Utilisateur";
    
    // Initiales dynamiques pour l'avatar
    const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <Target size={24} color="white" />
                    </div>
                    <h1>Ritmo</h1>
                </div>
            </div>

            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                    <Home size={20} />
                    <span>Tableau de bord</span>
                </Link>

                <Link to="/objectifs" className={`nav-item ${isActive('/objectifs')}`}>
                    <Target size={20} />
                    <span>Objectifs</span>
                </Link>

                <Link to="/calendrier" className={`nav-item ${isActive('/calendrier')}`}>
                    <Calendar size={20} />
                    <span>Calendrier</span>
                </Link>

                <Link to="/statistiques" className={`nav-item ${isActive('/statistiques')}`}>
                    <ChartLine size={20} />
                    <span>Statistiques</span>
                </Link>

                <Link to="/profil" className={`nav-item ${isActive('/profil')}`}>
                    <User size={20} />
                    <span>Profil</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{userInitials}</div>
                    <div className="user-details">
                        <h4>{userName}</h4>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;