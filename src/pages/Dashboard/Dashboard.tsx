import Sidebar from "../../components/Sidebar/Sidebar";
import Chart from "../../components/Chart/Chart";
import GoalCard from "../../components/GoalCard/GoalCard";
import "./Dashboard.css";

export default function Dashboard() {
  const statsCards = [
    { icon: "🔥", title: "Série en cours", stat: "14 jours" },
    { icon: "🏆", title: "Taux de réussite", stat: "87%" },
    { icon: "🎯", title: "Objectifs actifs", stat: "5" },
    { icon: "📅", title: "Jours réussis", stat: "23" },
  ];

  const dailyGoals = [
    { icon: "⏰", title: "Se réveiller à 6h", progress: 50, description: "Jour 15/30" },
    { icon: "🏃‍♂️", title: "30 min de sport", progress: 25, description: "Jour 8/30" },
    { icon: "📖", title: "Lire 20 pages", progress: 70, description: "Jour 22/30" },
  ];

  return (
    <div className="dashboard-wrapper">
      <Sidebar username={"AMA"} />

      <div className="dashboard-content">
        <h1>Tableau de bord</h1>
        <p className="subtitle">Suivez vos objectifs et habitudes quotidiennes</p>

        {/* Cards statistiques 2x2 */}
        <div className="stats-grid">
          {statsCards.map((card, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-info">
                <h3>{card.title}</h3>
                <p>{card.stat}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section basse : Chart et Objectifs du jour */}
        <div className="dashboard-bottom">
          <div className="chart-card">
            <h2>Progression hebdomadaire</h2>
            <Chart title={""} data={[]} />
          </div>

          <div className="today-goals">
            <h2>Objectifs du jour</h2>
            {dailyGoals.map((goal, idx) => (
              <GoalCard
                key={idx}
                icon={{ emoji: goal.icon, color: "#4CAF50" }}
                title={goal.title}
                stat={goal.description}
                progress={goal.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
