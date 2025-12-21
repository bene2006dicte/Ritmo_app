import  { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import goalsApi from '../../api/goals'; // Ton service API corrigé
import './Dashboard.css';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les statistiques dynamiques
  const [stats, setStats] = useState({
    maxStreak: 0,
    successRate: 0,
    activeCount: 0,
    totalCompletedDays: 0
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // On récupère les objectifs depuis ton API "/objectives"
      const response = await goalsApi.getAll();
      const data = response.data;
      
      setGoals(data);

      // Calcul simple des statistiques en attendant une route API dédiée aux stats
      const active = data.length;
      const streak = data.length > 0 ? Math.max(...data.map((g: any) => g.streak || 0)) : 0;
      
      setStats({
        maxStreak: streak,
        successRate: 0,// À calculer selon ton algorithme backend
        activeCount: active,
        totalCompletedDays: data.reduce((acc: number, g: any) => acc + (g.current || 0), 0)
      });

    } catch (error) {
      console.error("Erreur dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        <header className="content-header">
          <h1>Tableau de bord</h1>
          <p>Bienvenue dans votre espace de suivi d'habitudes</p>
        </header>

        {/* Section des Statistiques Dynamiques */}
        <section className="stats-grid">
          <StatCard 
            title="Série max" 
            value={`${stats.maxStreak} jours`} 
            trend="Actuel" 
            icon="🔥" 
            variant="orange" 
          />
          <StatCard 
            title="Taux de réussite" 
            value={`${stats.successRate}%`} 
            trend="+5% cette semaine" 
            icon="🏆" 
            variant="green" 
          />
          <StatCard 
            title="Objectifs actifs" 
            value={stats.activeCount.toString()} 
            trend="En cours" 
            icon="🎯" 
            variant="purple" 
          />
          <StatCard 
            title="Total jours" 
            value={stats.totalCompletedDays.toString()} 
            trend="Cumulé" 
            icon="📅" 
            variant="blue" 
          />
        </section>

        <div className="dashboard-main-zone">
          <div className="chart-container">
            <h3>Progression hebdomadaire</h3>
            <div className="placeholder-chart">
              {/* Ton composant Chart ira ici */}
              {loading ? <p>Chargement du graphique...</p> : <p>Graphique prêt</p>}
            </div>
          </div>

          <aside className="daily-goals-section">
            <div className="section-header">
              <h3>Objectifs du jour</h3>
              <button className="view-all-btn">Voir tous</button>
            </div>

            {loading ? (
              <p>Chargement des objectifs...</p>
            ) : (
              goals.slice(0, 3).map((goal: any) => (
                <div key={goal.id} className="goal-mini-card">
                  {/* Remplace par ton composant GoalCard quand il est prêt */}
                  <div className="goal-info">
                    <strong>{goal.title}</strong>
                    <span>{goal.current}/{goal.duration_value} {goal.duration_unit === 'days' ? 'j' : 'm'}</span>
                  </div>
                  <div className={`status-dot ${goal.streak > 0 ? 'active' : ''}`}></div>
                </div>
              ))
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;