import { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import { dashboardApi, type DashboardStats } from '../../api/Dashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeObjectives: 0,
    totalCompletedDays: 0,
    maxStreak: 0,
    successRate: 0,
    totalObjectiveDays: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      setStats(response);
    } catch (error) {
      console.error("Erreur récupération stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos statistiques...</p>
          </div>
        </main>
      </div>
    );
  }

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
            variant="orange"
          />
          <StatCard
            title="Taux de réussite"
            value={`${stats.successRate}%`}
            trend="Sur la durée"
            variant="green"
          />
          <StatCard
            title="Objectifs actifs"
            value={stats.activeObjectives.toString()}
            trend="En cours"
            variant="purple"
          />
          <StatCard
            title="Total jours"
            value={stats.totalCompletedDays.toString()}
            trend="Cumulé"
            variant="blue"
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
